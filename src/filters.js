const filters = {
  doubleToPercent: function(num) {
    return Math.round(num * 100) / 100
  },
  publishStatus: function(status) {
    if (status == 'DENIED') return 'danger'
    if (status == 'PUBLISHED') return 'success'
    return 'warning'
  }
}

export default filters
