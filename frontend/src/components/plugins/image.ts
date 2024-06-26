export class Image {
    data: any;
    wrapper: any;
    url: string = "";
    image: HTMLImageElement | null = null;

    constructor({data}: any) {
        this.data = data
        this.wrapper = undefined;
    }

    static get toolbox() {
        return {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24"><path d="M 4 4 C 2.9069372 4 2 4.9069372 2 6 L 2 18 C 2 19.093063 2.9069372 20 4 20 L 20 20 C 21.093063 20 22 19.093063 22 18 L 22 6 C 22 4.9069372 21.093063 4 20 4 L 4 4 z M 4 6 L 20 6 L 20 18 L 4 18 L 4 6 z M 14.5 11 L 11 15 L 8.5 12.5 L 5.7773438 16 L 18.25 16 L 14.5 11 z"></path></svg>',
            title: 'Image',
        };
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('simple-image');

        if (this.data && this.data.url){
            this._createImage(this.data.url, this.data.caption);
            return this.wrapper;
        }

        const input = document.createElement('input');

        this.wrapper.classList.add('simple-image');
        this.wrapper.appendChild(input);

        input.placeholder = 'Paste an image URL...';
        input.value = this.data && this.data.url ? this.data.url : '';

        input.addEventListener('paste', (event) => {
            if (event.clipboardData) {
                this._createImage(event.clipboardData.getData('text'));
            }
        });

        return this.wrapper;
    }

    _createImage(url: string, captionText?: string) {
        const image = document.createElement('img');
        const caption = document.createElement('input');
    
        image.src = url;
        caption.placeholder = 'Caption...';
        caption.value = captionText || '';
    
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(image);
        // this.wrapper.appendChild(caption);
    }

    validate(savedData: any){
        if (!savedData.url.trim()){
            return false;
        }
    
        return true;
    }

    save(blockContent: any){
        const image = blockContent.querySelector('img');
        const caption = blockContent.querySelector('input');
    
        return {
            url: image.src,
            // caption: caption.value
        }
    }
}