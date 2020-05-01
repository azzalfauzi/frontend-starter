((context) => {
  const _$ = context.document.querySelector.bind(context.document);

  // Sidebar
  const $sidebar = _$('.sidebar');
  context.toggleSidebar = () => {
    $sidebar.classList.toggle('toggled');
  }

})(window)

