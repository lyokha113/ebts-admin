export default function(editor, vue) {
  const blockManager = editor.BlockManager
  const domComponents = editor.DomComponents

  vue.userBlocks.forEach(block => {
    domComponents.addType(`Userblock ${block.id}`, {
      isComponent: el => {
        return (
          el instanceof HTMLElement &&
          el.getAttribute('datatype') == 'user block' &&
          el.getAttribute('name') == block.id
        )
      },
      model: {
        defaults: {
          attributes: {
            datatype: 'user block',
            name: `${block.id}`
          }
        }
      }
    })

    blockManager.add(`${block.id}`, {
      label: block.name,
      category: 'User Blocks',
      attributes: { class: `fa fa-${block.icon}` },
      content: {
        type: `Userblock ${block.id}`,
        content: block.content,
        droppable: false
      }
    })
  })
}
