import {LitElement, customElement, html} from 'lit-element'

@customElement('my-element')
class MyElement extends LitElement {
  render() {
    return html`
      <div>Hello World</div>
    `
  }
}