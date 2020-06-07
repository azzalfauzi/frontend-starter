window.UI = (() => {
  const _$ = document.querySelector.bind(document);
  const _$$ = document.querySelectorAll.bind(document);

  /**
   * Sidebar
   */
  const $sidebar = _$(".sidebar");
  window.toggleSidebar = () => {
    $sidebar.classList.toggle("toggled");
  };

  // Toggle sidebar menu item's submenu on click
  $sidebar.querySelectorAll(".sidebar-menu-parent").forEach(($el) => {
    $el.addEventListener("click", () => $el.classList.toggle("open"));
  });

  /**
   * Tab
   */
  function tab($currentButton, id) {
    const $currentPanel = _$("#" + id);

    if (!$currentPanel) return;

    $currentButton
      .closest(".tab-navs")
      .querySelector(".active")
      .classList.remove("active");

    $currentPanel
      .closest(".tab")
      .querySelector(".tab-panel.active")
      .classList.remove("active");

    $currentButton.closest(".tab-nav").classList.add("active");
    $currentPanel.classList.add("active");

    $currentButton.blur();
  }

  return {
    toggleSidebar,
    tab,
  };
})();
