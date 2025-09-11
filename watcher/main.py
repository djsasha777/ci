import asyncio
import logging
import os
import time
import yaml
from kubernetes_asyncio import client, config, watch
import git

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

repo_url = os.getenv('REPO')
branch = os.getenv('BRANCH')
filePath = os.getenv('FILEPATH')
token = os.getenv('TOKEN')
external_label = os.getenv('EXTERNAL')

# ... [Keep your existing functions here unchanged except print -> logger calls]


async def watch_ingress(repo):
    networking_v1 = client.NetworkingV1Api()
    w = watch.Watch()
    while True:
        try:
            async for event in w.stream(networking_v1.list_ingress_for_all_namespaces, timeout_seconds=60):
                event_type = event['type']
                ingress = event['object']
                annotations = ingress.metadata.annotations or {}

                if annotations.get('kubernetes.io/ingress.class') != 'nginx':
                    continue

                name = ingress.metadata.name

                if event_type == 'ADDED':
                    ingress_ip = None
                    if ingress.status.load_balancer and ingress.status.load_balancer.ingress:
                        if len(ingress.status.load_balancer.ingress) > 0:
                            ingress_ip = ingress.status.load_balancer.ingress[0].ip
                    has_issuer = annotations.get('cert-manager.io/cluster-issuer') == "letsencrypt-production"
                    logger.info(f"New ingress - Name: {name}, IP: {ingress_ip}, Has issuer: {has_issuer}")
                    update_haproxy(repo, name, ingress_ip, has_issuer)

                elif event_type == 'DELETED':
                    logger.info(f"Ingress deleted - Name: {name}. Removing from YAML...")
                    remove_ingress_from_yaml(repo, name)

        except Exception as e:
            logger.error(f"Watch ingress error: {e}")
            await asyncio.sleep(10)


async def watch_service(repo):
    core_v1 = client.CoreV1Api()
    w = watch.Watch()
    while True:
        try:
            async for event in w.stream(core_v1.list_service_for_all_namespaces, timeout_seconds=60):
                event_type = event['type']
                service = event['object']
                labels = service.metadata.labels or {}

                if service.spec.type != "LoadBalancer" or external_label not in labels:
                    continue

                service_name = service.metadata.name

                if event_type == 'ADDED':
                    service_ip = None
                    if service.status.load_balancer and service.status.load_balancer.ingress:
                        if len(service.status.load_balancer.ingress) > 0:
                            service_ip = service.status.load_balancer.ingress[0].ip
                    logger.info(f"New service - Name: {service_name}, IP: {service_ip}, Label found: {external_label}")
                    if service_ip:
                        add_service_to_haproxy(repo, service_name, service_ip)

                elif event_type == 'DELETED':
                    logger.info(f"Service deleted - Name: {service_name}. Removing from YAML...")
                    remove_service_from_haproxy(repo, service_name)

        except Exception as e:
            logger.error(f"Watch service error: {e}")
            await asyncio.sleep(10)


async def main_async():
    logger.info("Updating Kubernetes ingress and service configuration (async version)")

    try:
        await config.load_incluster_config()
    except Exception as e:
        logger.error(f"Error loading in-cluster config: {e}")
        return

    try:
        auth_repo_url = get_auth_repo_url(repo_url, token)
        repo = clone_or_update_repo(auth_repo_url, branch)
    except Exception as e:
        logger.error(f"Error setting up git repo: {e}")
        return

    rebuild_yaml_from_current(repo)

    # Run ingress and service watchers concurrently
    await asyncio.gather(watch_ingress(repo), watch_service(repo))


if __name__ == "__main__":
    asyncio.run(main_async())
