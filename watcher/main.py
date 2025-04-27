import time
from kubernetes import client, config, watch
import os

lbtype = os.getenv('LBTYPE')
domain = os.getenv('DOMAIN')

# Загружаем конфигурацию кластера Kubernetes
config.load_incluster_config()
v1 = client.CoreV1Api()

def update_haproxy_config(svc):
    # Логика обновления конфигурации HAProxy
    print(f"Обновляем конфигурацию HAProxy для сервиса {svc.metadata.name}.{domain}")
    
    # Здесь вы можете добавить код для изменения конфигурации HAProxy,

    pass

def main():
    print(f"Обновляем конфигурацию")
    w = watch.Watch()
    while True:
        try:
            for event in w.stream(v1.list_service_for_all_namespaces, _request_timeout=60):
                if event['type'] == 'ADDED' and event['object'].metadata.labels.get('lbtype') == {lbtype}:
                    service = event['object']
                    if service.spec.type == 'LoadBalancer':
                        update_haproxy_config(svc)
        except Exception as e:
            print("Ошибка:", e)
            time.sleep(10)
            
if __name__ == "__main__":
    main()