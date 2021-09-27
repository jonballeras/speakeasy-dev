// Create and mount the thumbnails slider.
var secondarySlider = new Splide('.product-gallery__nav', {
  //direction: 'ttb',
  rewind: false,
  autoHeight: true,
  perMove: 1,
  gap: 0,
  focus: 'center',
  arrows: false,
  pagination: false,
  isNavigation: true
}).mount();

// Create the main slider.
var primarySlider = new Splide('.product-gallery__images-wrapper', {
  gap: 20,
  pagination: false,
  arrows: true
});

// Set the thumbnails slider as a sync target and then call mount.
primarySlider.sync( secondarySlider ).mount();
