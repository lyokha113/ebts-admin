export default function(editor) {
  const blockManager = editor.BlockManager
  const domComponents = editor.DomComponents

  domComponents.addType('dynamic-text', {
    isComponent: el => {
      return (
        el instanceof HTMLElement &&
        el.getAttribute('datatype') == 'dynamic text'
      )
    },
    model: {
      defaults: {
        traits: [
          { name: 'name', placeholder: 'Component name' },
          { name: 'text', placeholder: 'Default text' }
        ],
        attributes: { datatype: 'dynamic text' }
      },
      init() {
        this.on('change:attributes:text', this.handleTextChange)
      },

      handleTextChange() {
        const text = this.getAttributes().text
        editor.getSelected().set('content', text)
      }
    }
  })

  domComponents.addType('dynamic-link', {
    isComponent: el => {
      return (
        el instanceof HTMLElement &&
        el.getAttribute('datatype') == 'dynamic link'
      )
    },
    model: {
      defaults: {
        tagName: 'a',
        traits: [
          { name: 'name', placeholder: 'Component name' },
          { name: 'text', placeholder: 'Default text' },
          { name: 'href', placeholder: 'Default link' },
          {
            type: 'select',
            name: 'target',
            options: [
              { name: 'New windows', value: '_blank' },
              { name: 'This window', value: '_top' }
            ]
          }
        ],
        attributes: {
          datatype: 'dynamic link',
          href: 'about:blank',
          target: '_blank'
        }
      },
      init() {
        this.on('change:attributes:text', this.handleTextChange)
      },

      handleTextChange() {
        const text = this.getAttributes().text
        editor.getSelected().set('content', text)
      }
    }
  })

  domComponents.addType('dynamic-image', {
    isComponent: el => {
      return (
        el instanceof HTMLElement &&
        el.getAttribute('datatype') == 'dynamic image'
      )
    },
    model: {
      defaults: {
        tagName: 'img',
        traits: [
          { name: 'name', placeholder: 'Component name' },
          { name: 'alt', placeholder: 'Alt' }
        ],
        attributes: {
          datatype: 'dynamic image',
          alt: 'dynamic image',
          width: '100',
          height: '100',
          src:
            'https://firebasestorage.googleapis.com/v0/b/etbs-441a1.appspot.com/o/default%2Fimage_block.png?alt=media&token=e9e4a4f7-449b-495d-9d52-196969774003'
        },
        resizable: {
          tl: 0,
          tc: 0,
          tr: 0,
          cl: 0,
          bl: 0
        }
      },
      init() {
        this.on('change:attributes:width', this.handleWidthChange)
        this.on('change:attributes:height', this.handleHeightChange)
      },

      handleWidthChange() {
        const width = this.getAttributes().width
        editor.getSelected().set('width', width)
      },

      handleHeightChange() {
        const height = this.getAttributes().height
        editor.getSelected().set('height', height)
      }
    }
  })

  blockManager.add('dynamic text', {
    label: 'Dynamic Text',
    category: 'Dynamic Content',
    attributes: { class: 'gjs-fonts gjs-f-text' },
    content: {
      type: 'dynamic-text',
      content: 'Dynamic Text',
      style: { color: 'lightgrey', padding: '10px' },
      droppable: false
    }
  })

  blockManager.add('dynamic link', {
    label: 'Dynamic Link',
    category: 'Dynamic Content',
    attributes: { class: 'fa fa-external-link' },
    content: {
      type: 'dynamic-link',
      content: 'Dynamic Link',
      style: { color: '#3b97e3', padding: '0 10px 0 10px' },
      droppable: false
    }
  })

  blockManager.add('dynamic image', {
    label: 'Dynamic Image',
    category: 'Dynamic Content',
    attributes: { class: 'fa fa-file-image-o' },
    content: {
      type: 'dynamic-image',
      droppable: false
    }
  })
}
