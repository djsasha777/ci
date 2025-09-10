import time
import os
import yaml
from kubernetes import client, config, watch
import git

repo_url = os.getenv('REPO')  # Пример: https://github.com/djsasha777/infra.git
branch = os.getenv('BRANCH', 'main')
filePath = os.getenv('FILEPATH')  # Пример: infra/ansible/loadbalancer-haproxy/group_vars/all.yaml
token = os.getenv('TOKEN')  # GitHub token

# Настройка URL для доступа с токеном
def get_auth_repo_url(repo_url, token):
    if repo_url.startswith("https://"):
        return repo_url.replace("https://", f"https://{token}@")
    return repo_url

def update_haproxy(ingress_name, ingress_ip):
    repo_path = "/tmp/repo"
    auth_repo_url = get_auth_repo_url(repo_url, token)

    # Клонирование или обновление репозитория
    if not os.path.exists(repo_path):
        print("Клонирование репозитория...")
        repo = git.Repo.clone_from(auth_repo_url, repo_path, branch=branch)
    else:
        repo = git.Repo(repo_path)
        repo.git.checkout(branch)
        repo.remotes.origin.pull()

    values_path = os.path.join(repo_path, filePath)

    # Загрузка YAML файла
    with open(values_path, 'r') as f:
        data = yaml.safe_load(f) or {}

    if "haproxySubdomain" not in data or data["haproxySubdomain"] is None:
        data["haproxySubdomain"] = []

    if "acmeSubdomain" not in data or data["acmeSubdomain"] is None:
        data["acmeSubdomain"] = []

    # Обновление или добавление новых записей
    found = False
    for entry in data["haproxySubdomain"]:
        if entry.get("name") == ingress_name:
            entry["ip"] = ingress_ip
            entry["port"] = 443
            entry["proxy"] = False
            found = True
            break

    for entry in data["acmeSubdomain"]:
        if entry.get("name") == ingress_name:
            entry["ip"] = ingress_ip
            entry["port"] = 80
            found = True
            break

    if not found:
        data["haproxySubdomain"].append({
            "name": ingress_name,
            "ip": ingress_ip,
            "port": 443,
            "proxy": False
        })
        data["acmeSubdomain"].append({
            "name": ingress_name,
            "ip": ingress_ip,
            "port": 80
        })

    # Сохранение изменений
    with open(values_path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)

    # Коммит и пуш
    repo.git.add(filePath)
    repo.index.commit(f"Update haproxySubdomain with ingress name: {ingress_name}")
    origin = repo.remote(name='origin')
    origin.push(branch)
    print(f"Git изменения запушены для {ingress_name}")

def main():
    print("Обновляем конфигурацию Kubernetes ingresses")

    # Загружаем конфигурацию внутри кластера
    config.load_incluster_config()
    networking_v1 = client.NetworkingV1Api()
    w = watch.Watch()

    def scan_existing_ingress():
        ingresses = networking_v1.list_ingress_for_all_namespaces().items
        for ingress in ingresses:
            annotations = ingress.metadata.annotations or {}

            if annotations.get('kubernetes.io/ingress.class') == 'nginx' and annotations.get('cert-manager.io/cluster-issuer') == 'letsencrypt-production':
                name = ingress.metadata.name

                ingress_ip = None
                if ingress.status.load_balancer and ingress.status.load_balancer.ingress:
                    if len(ingress.status.load_balancer.ingress) > 0:
                        ingress_ip = ingress.status.load_balancer.ingress[0].ip

                print(f"Scan existing - Name: {name}, IP: {ingress_ip}")
                update_haproxy(name, ingress_ip)

    scan_existing_ingress()

    while True:
        try:
            stream = w.stream(networking_v1.list_ingress_for_all_namespaces, _request_timeout=60)
            for event in stream:
                event_type = event['type']
                ingress = event['object']
                annotations = ingress.metadata.annotations or {}

                if (event_type == 'ADDED'
                    and annotations.get('kubernetes.io/ingress.class') == 'nginx'
                    and annotations.get('cert-manager.io/cluster-issuer') == 'letsencrypt-production'):

                    name = ingress.metadata.name
                    ingress_ip = None
                    if ingress.status.load_balancer and ingress.status.load_balancer.ingress:
                        if len(ingress.status.load_balancer.ingress) > 0:
                            ingress_ip = ingress.status.load_balancer.ingress[0].ip

                    print(f"New ingress - Name: {name}, IP: {ingress_ip}")
                    update_haproxy(name, ingress_ip)

        except Exception as e:
            print(f"Ошибка в watch: {e}")
            time.sleep(10)


if __name__ == "__main__":
    main()
