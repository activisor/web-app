// pub-sub event system

const eventBus: Document = document;

function subscribe(eventName: string, listener: any) : void {
    eventBus.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: any) : void {
    eventBus.removeEventListener(eventName, listener);
}

function publish(eventName: string, data: object) : void {
    const event = new CustomEvent(eventName, { detail: data });
    eventBus.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };