export default class Toaster {
    constructor(container){
        this.container = container;
        this.toast = null;
        this.timeoutId = null;
    }

    show(message,duration=3000){
        // handle case when toast still exist
        if(this.toast){
            this.toast.remove();
            clearTimeout(this.timeoutId);
        }

        this.toast = document.createElement("div");
        this.toast.className = 'toast';
        this.toast.textContent = message

        this.container.appendChild(this.toast)

        this.timeoutId = setTimeout(()=>{
            this.toast.remove()
            this.toast = null;
        }, duration)
    }
}