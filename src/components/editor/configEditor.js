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
      isComponent: el => {
        el instanceof HTMLElement &&
          el.getAttribute('datatype') === 'dynamic text'
      },
      model: {
        defaults: {
          traits: [
            { name: 'name', placeholder: 'Field name' },
            { name: 'text', placeholder: 'Default text' }
          ],
          attributes: { dataType: 'dynamic text' }
        }
      }
    })

    domComponents.addType('dynamic link', {
      isComponent: el => {
        el instanceof HTMLElement &&
          el.getAttribute('datatype') === 'dynamic link'
      },
      model: {
        defaults: {
          tagName: 'a',
          traits: [
            { name: 'name', placeholder: 'Field name' },
            { name: 'text', placeholder: 'Text to show' },
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
            text: 'Dynamic link',
            href: 'about:blank',
            target: '_blank'
          }
        }
      }
    })
  }

  const addDynamicBlocks = () => {
    blockManager.add('dynamic text', {
      label: 'Dynamic Text',
      category: 'Dynamic Content',
      attributes: { class: 'gjs-fonts gjs-f-text' },
      content: {
        type: 'dynamic text',
        content: 'Dynamic Text',
        style: { color: 'lightgrey', padding: '10px' }
      }
    })

    blockManager.add('dynamic link', {
      label: 'Dynamic Link',
      category: 'Dynamic Content',
      attributes: { class: 'fa fa-link' },
      content: {
        type: 'dynamic link',
        content: 'Dynamic Link',
        style: { color: '#3b97e3', padding: '5px' }
      }
    })
  }

  const addButtons = () => {
    panelManager.addButton('options', {
      id: 'myNewButton',
      className: 'someClass',
      attributes: { title: 'Export' },
      active: false,
      command: () => {
        console.log(blockManager.getCategories())
      }
    })
  }

  removeRedoUndo()
  setBlockCategories()
  addDynamicTypes()
  addDynamicBlocks()
  addButtons()
}
