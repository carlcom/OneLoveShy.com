(function () {
  var findForm = document.querySelector('[data-find-form]');
  if (!findForm) return;

  var input = findForm.querySelector('input[name="q"]');
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');
  var summary = document.getElementById('find-query');
  var filterForm = document.querySelector('[data-directory-filters]');

  if (filterForm) {
    Array.prototype.forEach.call(filterForm.elements, function (control) {
      if (!control.name || control.type === 'submit') return;

      var values = params.getAll(control.name);
      if (control.type === 'checkbox' || control.type === 'radio') {
        control.checked = values.indexOf(control.value) !== -1;
      } else if (values.length) {
        control.value = values[0];
      }
    });
  }

  if (query !== null) {
    input.value = query;
  }

  if (summary) {
    var hasFilters = Array.from(params.entries()).some(function (entry) {
      return entry[0] !== 'q' && entry[0] !== 'sort' && entry[1] !== '';
    });

    if (query) {
      summary.textContent = 'Search preview for "' + query + '". The live member directory is not available yet.';
    } else if (hasFilters) {
      summary.textContent = 'Your filters are saved in this preview, but live profile search is not available yet.';
    } else {
      summary.textContent = 'Search broadly: for a partner, a friend, a collaborator, a community, or an organization.';
    }
  }

  function redirectPrototypePlace(value, event) {
    var normalized = value.toLowerCase();
    var localPreview = window.location.protocol === 'file:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (normalized === 'me') {
      event.preventDefault();
      window.location.href = localPreview ? 'me.html' : 'https://me.oneloveshy.com/';
      return true;
    }

    if (normalized === 'your-name') {
      event.preventDefault();
      window.location.href = localPreview ? 'name.html' : 'https://your-name.oneloveshy.com/';
      return true;
    }

    return false;
  }

  if (filterForm) {
    filterForm.addEventListener('submit', function (event) {
      redirectPrototypePlace(input.value.trim(), event);
    });
  } else if (findForm.tagName === 'FORM') {
    findForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = input.value.trim();
      if (redirectPrototypePlace(value, event)) return;

      window.location.href = value
        ? 'find.html?q=' + encodeURIComponent(value)
        : 'find.html';
    });
  }
})();
