if (typeof window !== 'undefined' && typeof window.isNumber === 'undefined') {
    window.isNumber = function (value) {
      return typeof value === 'number' && !isNaN(value);
    };
  }
  