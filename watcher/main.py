import time
from kubernetes import client, config, watch
import git
import os
import yaml

lbtype = os.getenv('LBTYPE')
domain = os.getenv('DOMAIN')
repo_url = os.getenv('REPO')
branch = os.getenv('BRANCH')

# Загружаем конфигурацию кластера Kubernetes
config.load_incluster_config()
v1 = client.CoreV1Api()

def update_haproxy(ingress_name, local_path="/tmp/repo"):
    # Клонируем репозиторий (если есть, то обновляем)
    if not os.path.exists(local_path):
        repo = git.Repo.clone_from({repo_url}, local_path, branch={branch})
    else:
        repo = git.Repo(local_path)
        repo.git.checkout({branch})
        repo.remotes.origin.pull()

    values_path = os.path.join(local_path, "values.yaml")

    # Загружаем yaml
    with open(values_path, 'r') as f:
        data = yaml.safe_load(f)

    # Добавляем имя ingress в секцию (например, создадим ключ ingressNames как список)
    if not data:
        data = {}
    if "ingressNames" not in data:
        data["ingressNames"] = []

    if ingress_name not in data["ingressNames"]:
        data["ingressNames"].append(ingress_name)

    # Записываем обратно
    with open(values_path, 'w') as f:
        yaml.dump(data, f)

    # Делам git add, commit, push
    repo.git.add("values.yaml")
    repo.index.commit(f"Add new ingress name: {ingress_name}")
    origin = repo.remote(name='origin')
    origin.push(branch)

def main():
    print(f"Обновляем конфигурацию")
    w = watch.Watch()
    while True:
        try:
            for event in w.stream(v1.list_ingress_for_all_namespaces, _request_timeout=60):
                if event['type'] == 'ADDED' and event['object'].metadata.annotations.get('kubernetes.io/ingress.class') == 'nginx' and event['object'].metadata.annotations.get('cert-manager.io/cluster-issuer') == 'letsencrypt-production':
                    ingress = event['object']
                    name = ingress.metadata.name
                    update_haproxy(name)

        except Exception as e:
            print("Ошибка:", e)
            time.sleep(10)
            
if __name__ == "__main__":
    main()