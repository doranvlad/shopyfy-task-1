//https://alpinejs.dev/
export const exampleComponent = () => ({
    isVisible: false,
    init() { // Alpine reserved function read doc https://alpinejs.dev/directives/init#auto-evaluate-init-method
        this.isVisible = true;
    }
})