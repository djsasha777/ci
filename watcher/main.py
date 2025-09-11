import time
import os
import yaml
from kubernetes import client, config, watch
import git


repo_url = os.getenv('REPO')
branch = os.getenv('BRANCH')
filePath = os.getenv('FILEPATH')
token = os.getenv('TOKEN')
external_label = os.getenv('EXTERNAL')


def get_auth_repo_url(repo_url, token):
    try:
        if repo_url.startswith("https://"):
            return repo_url.replace("https://", f"https://{token}@")
        return repo_url
    except Exception as e:
        print(f"Error in get_auth_repo_url: {e}")
        raise


def clone_or_update_repo(auth_repo_url, branch, repo_path="/tmp/repo"):
    try:
        if not os.path.exists(repo_path):
            print("Cloning repository...")
            repo = git.Repo.clone_from(auth_repo_url, repo_path, branch=branch)
        else:
            repo = git.Repo(repo_path)
            repo.git.checkout(branch)
            print("Pulling latest changes from the repository...")
            repo.remotes.origin.pull()
        return repo
    except Exception as e:
        print(f"Error in clone_or_update_repo: {e}")
        raise


def update_haproxy(repo, ingress_name, ingress_ip, has_issuer):
    try:
        values_path = os.path.join(repo.working_tree_dir, filePath)

        with open(values_path, 'r') as f:
            data = yaml.safe_load(f) or {}

        if "haproxySubdomain" not in data or data["haproxySubdomain"] is None:
            data["haproxySubdomain"] = []
        if "acmeSubdomain" not in data or data["acmeSubdomain"] is None:
            data["acmeSubdomain"] = []

        found_haproxy = False
        found_acme = False

        for entry in data["haproxySubdomain"]:
            if entry.get("name") == ingress_name:
                entry["ip"] = ingress_ip
                entry["port"] = 443
                entry["proxy"] = False
                found_haproxy = True
                break

        if has_issuer:
            for entry in data["acmeSubdomain"]:
                if entry.get("name") == ingress_name:
                    entry["ip"] = ingress_ip
                    entry["port"] = 80
                    found_acme = True
                    break

        if not found_haproxy:
            data["haproxySubdomain"].append({
                "name": ingress_name,
                "ip": ingress_ip,
                "port": 443,
                "proxy": False
            })

        if has_issuer and not found_acme:
            data["acmeSubdomain"].append({
                "name": ingress_name,
                "ip": ingress_ip,
                "port": 80
            })

        with open(values_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)

        repo.git.add(filePath)
        repo.index.commit(f"Update haproxySubdomain with ingress name: {ingress_name}")
        origin = repo.remote(name='origin')
        origin.push(branch)
        print(f"Git changes pushed for {ingress_name}")

    except Exception as e:
        print(f"Error in update_haproxy for ingress {ingress_name}: {e}")


def remove_ingress_from_yaml(repo, ingress_name):
    try:
        values_path = os.path.join(repo.working_tree_dir, filePath)
        with open(values_path, 'r') as f:
            data = yaml.safe_load(f) or {}

        if "haproxySubdomain" in data and data["haproxySubdomain"]:
            data["haproxySubdomain"] = [entry for entry in data["haproxySubdomain"] if entry.get("name") != ingress_name]

        if "acmeSubdomain" in data and data["acmeSubdomain"]:
            data["acmeSubdomain"] = [entry for entry in data["acmeSubdomain"] if entry.get("name") != ingress_name]

        with open(values_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)

        repo.git.add(filePath)
        repo.index.commit(f"Remove ingress {ingress_name} from haproxy and acme subdomains")
        origin = repo.remote(name='origin')
        origin.push(branch)
        print(f"Removed ingress {ingress_name} and pushed changes")

    except Exception as e:
        print(f"Error in remove_ingress_from_yaml for ingress {ingress_name}: {e}")


def add_service_to_haproxy(repo, service_name, service_ip):
    try:
        values_path = os.path.join(repo.working_tree_dir, filePath)

        with open(values_path, 'r') as f:
            data = yaml.safe_load(f) or {}

        if "haproxySubdomain" not in data or data["haproxySubdomain"] is None:
            data["haproxySubdomain"] = []

        for entry in data["haproxySubdomain"]:
            if entry.get("name") == service_name:
                entry["ip"] = service_ip
                entry["port"] = 443
                entry["proxy"] = False
                break
        else:
            data["haproxySubdomain"].append({
                "name": service_name,
                "ip": service_ip,
                "port": 443,
                "proxy": False
            })

        with open(values_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)

        repo.git.add(filePath)
        repo.index.commit(f"Add/update service {service_name} in haproxySubdomain")
        origin = repo.remote(name='origin')
        origin.push(branch)
        print(f"Git changes pushed for service {service_name}")

    except Exception as e:
        print(f"Error in add_service_to_haproxy for service {service_name}: {e}")


def remove_service_from_haproxy(repo, service_name):
    try:
        values_path = os.path.join(repo.working_tree_dir, filePath)
        with open(values_path, 'r') as f:
            data = yaml.safe_load(f) or {}

        if "haproxySubdomain" in data and data["haproxySubdomain"]:
            data["haproxySubdomain"] = [entry for entry in data["haproxySubdomain"] if entry.get("name") != service_name]

        with open(values_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)

        repo.git.add(filePath)
        repo.index.commit(f"Remove service {service_name} from haproxySubdomain")
        origin = repo.remote(name='origin')
        origin.push(branch)
        print(f"Removed service {service_name} and pushed changes")

    except Exception as e:
        print(f"Error in remove_service_from_haproxy for service {service_name}: {e}")


def rebuild_yaml_from_current(repo):
    try:
        values_path = os.path.join(repo.working_tree_dir, filePath)

        networking_v1 = client.NetworkingV1Api()
        core_v1 = client.CoreV1Api()

        ingresses = networking_v1.list_ingress_for_all_namespaces().items
        services = core_v1.list_service_for_all_namespaces().items

        data = {
            "haproxySubdomain": [],
            "acmeSubdomain": []
        }

        for ingress in ingresses:
            annotations = ingress.metadata.annotations or {}
            if annotations.get('kubernetes.io/ingress.class') != 'nginx':
                continue

            name = ingress.metadata.name
            ingress_ip = None
            if ingress.status.load_balancer and ingress.status.load_balancer.ingress:
                if len(ingress.status.load_balancer.ingress) > 0:
                    ingress_ip = ingress.status.load_balancer.ingress[0].ip
            has_issuer = annotations.get('cert-manager.io/cluster-issuer') == "letsencrypt-production"

            if ingress_ip:
                data["haproxySubdomain"].append({
                    "name": name,
                    "ip": ingress_ip,
                    "port": 443,
                    "proxy": False
                })
                if has_issuer:
                    data["acmeSubdomain"].append({
                        "name": name,
                        "ip": ingress_ip,
                        "port": 80
                    })

        for service in services:
            if service.spec.type != "LoadBalancer":
                continue
            labels = service.metadata.labels or {}
            if not external_label or external_label not in labels:
                continue

            service_name = service.metadata.name
            service_ip = None
            if service.status.load_balancer and service.status.load_balancer.ingress:
                if len(service.status.load_balancer.ingress) > 0:
                    service_ip = service.status.load_balancer.ingress[0].ip

            if service_ip:
                if not any(entry["name"] == service_name for entry in data["haproxySubdomain"]):
                    data["haproxySubdomain"].append({
                        "name": service_name,
                        "ip": service_ip,
                        "port": 443,
                        "proxy": False
                    })

        with open(values_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)

        repo.git.add(filePath)
        repo.index.commit("Rebuild haproxySubdomain and acmeSubdomain from current ingress and services")
        origin = repo.remote(name='origin')
        origin.push(branch)
        print("Git changes pushed after rebuilding YAML from current cluster state")

    except Exception as e:
        print(f"Error in rebuild_yaml_from_current: {e}")


def main():
    print("Updating Kubernetes ingress and service configuration")

    try:
        config.load_incluster_config()
    except Exception as e:
        print(f"Error loading in-cluster config: {e}")
        return

    networking_v1 = client.NetworkingV1Api()
    core_v1 = client.CoreV1Api()
    w = watch.Watch()

    try:
        auth_repo_url = get_auth_repo_url(repo_url, token)
        repo = clone_or_update_repo(auth_repo_url, branch)
    except Exception as e:
        print(f"Error setting up git repo: {e}")
        return

    rebuild_yaml_from_current(repo)

    while True:
        try:
            stream_ingress = w.stream(networking_v1.list_ingress_for_all_namespaces, _request_timeout=60)
            stream_service = w.stream(core_v1.list_service_for_all_namespaces, _request_timeout=60)

            # Process ingress events
            for event in stream_ingress:
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
                    print(f"New ingress - Name: {name}, IP: {ingress_ip}, Has issuer: {has_issuer}")
                    update_haproxy(repo, name, ingress_ip, has_issuer)

                elif event_type == 'DELETED':
                    print(f"Ingress deleted - Name: {name}. Removing from YAML...")
                    remove_ingress_from_yaml(repo, name)

            # Process service events
            for event in stream_service:
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
                    print(f"New service - Name: {service_name}, IP: {service_ip}, Label found: {external_label}")
                    if service_ip:
                        add_service_to_haproxy(repo, service_name, service_ip)

                elif event_type == 'DELETED':
                    print(f"Service deleted - Name: {service_name}. Removing from YAML...")
                    remove_service_from_haproxy(repo, service_name)

        except Exception as e:
            print(f"Watch error: {e}")
            time.sleep(10)


if __name__ == "__main__":
    main()
