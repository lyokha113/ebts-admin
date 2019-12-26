export default function(editor) {
  const panelManager = editor.Panels
  const blockManager = editor.BlockManager
  // const traitManager = editor.TraitManager
  const domComponents = editor.DomComponents

  const sectionBlocksIds = ['sect100', 'sect50', 'sect30', 'sect37']
  const listBlocksIds = ['text-sect', 'grid-items', 'list-items']
  const basicBlocksIds = [
    'button',
    'text',
    'divider',
    'image',
    'quote',
    'link',
    'link-block'
  ]

  const removeRedoUndo = () => {
    panelManager.removeButton('commands', 'undo')
    panelManager.removeButton('commands', 'redo')
  }

  const setBlockCategories = () => {
    blockManager.getAll().forEach(b => {
      if (sectionBlocksIds.includes(b.id)) b.set('category', 'Section')
      if (listBlocksIds.includes(b.id)) b.set('category', 'List Section')
      if (basicBlocksIds.includes(b.id)) b.set('category', 'Basic')
    })
  }

  const addDynamicTypes = () => {
    domComponents.addType('dynamic text', {
      isComponent: el => el.getAttribute('datatype') === 'dynamic text',
      model: {
        defaults: {
          traits: [
            { name: 'name', placeholder: 'Field name' },
            { name: 'text', placeholder: 'Default text' }
          ],
          attributes: { dataType: 'dynamic text' }
        }
      },
      view: {
        onRender() {
          const { $el } = this
          $el.empty()
          $el.append(
            '<div style="color: lightgrey; padding: 10px">Dynamic Text</div>'
          )
        }
      }
    })

    domComponents.addType('dynamic link', {
      isComponent: el => el.getAttribute('datatype') === 'dynamic link',
      model: {
        defaults: {
          tagName: 'a',
          traits: [
            { name: 'name', placeholder: 'Field name' },
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
            dataType: 'dynamic link',
            href: 'about:blank',
            target: '_blank'
          }
        }
      },
      view: {
        onRender() {
          const { $el } = this
          $el.empty()
          $el.append(
            '<a href="about:blank" style="color: #3b97e3;padding: 5px">Dynamic Link</a>'
          )
        }
      }
    })
  }

  const addDynamicBlocks = () => {
    blockManager.add('dynamic text', {
      label: 'Dynamic Text',
      category: 'Dynamic Content',
      attributes: { class: 'gjs-fonts gjs-f-text' },
      content: { type: 'dynamic text' }
    })

    blockManager.add('dynamic link', {
      label: 'Dynamic Link',
      category: 'Dynamic Content',
      attributes: { class: 'fa fa-link' },
      content: {
        type: 'dynamic link',
        content: 'Link',
        style: { color: '#3b97e3' }
      }
    })
  }

  const addButtons = () => {
    panelManager.addButton('options', {
      id: 'myNewButton',
      className: 'someClass',
      attributes: { title: 'Some title' },
      active: false,
      command: () => {
        // const components = domComponents.getComponents()
        // components.forEach(c => {
        //   if (c.get('type') == 'dynamic-text') {
        //     console.log(c.props())
        //     console.log(c.getAttributes())
        //     console.log(c.getTrait('Name'))
        //   }
        // })
        // <div datatype="dynamic text" name="hhh" id="iaqu" style="box-sizing: border-box;"></div>
        console.log(this.editor.runCommand('gjs-get-inlined-html'))
      }
    })
  }

  removeRedoUndo()
  setBlockCategories()
  addDynamicTypes()
  addDynamicBlocks()
  addButtons()
}
