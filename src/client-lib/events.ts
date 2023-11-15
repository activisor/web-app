// pub-sub event system

function subscribe(eventName: string, listener: any): void {
    if (document) {
        document.addEventListener(eventName, listener);
    }
}

function unsubscribe(eventName: string, listener: any): void {
    if (document) {
        document.removeEventListener(eventName, listener);
    }
}

function publish(eventName: string, data: object): void {
    if (document) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}

export { publish, subscribe, unsubscribe };