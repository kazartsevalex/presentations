$(document).ready(function() {
    
    var readySliders = 0;
    
    var yandexPage = {
        sliders: [],
        presentations: $('[data-class="slider-container"]'),
        loadingOverlay: $('#loading'),
        main: $('#main'),
        presentationContainers: $('.presentation-container'),
        
        init: function() {
            var _this = this;
            
            _this.presentations.each(function() {            
                var newSlider = new Slider($(this));
                newSlider.init();
                _this.sliders.push(newSlider);
            });

            if (readySliders == _this.presentations.length) {
                _this.loadingOverlay.hide();
                _this.presentationContainers.hide();
            }
        }
    }
    yandexPage.init();
    
    $(window).on('resize', function() {
        var slidersLength = yandexPage.sliders.length;
        for (var i = 0; i < slidersLength; i++) {
            yandexPage.sliders[i].resize();
        }
    });
        
    function Slider(presentationDiv) {
        this.presentationDiv = presentationDiv;
        this.presentationCont = $(presentationDiv.find('.presentation-container')[0]);
        this.sliderDiv = $(presentationDiv.find('.presentation-content')[0]);
        this.sliderUl = $(this.sliderDiv.find('ul')[0]);
        this.slidesVisible = 4;
        this.slides = this.sliderUl.find('.presentation-item');    
        this.slidesCount = this.slides.length;
        this.slideHeight = 0;
        this.slideWidth = 0;
        this.slidePadding = 0;
        this.prev = null;
        this.next = null;
        this.currentSlide = null;
        this.active = 0;
        this.additional = 0;
        this.prevClass = 'control-prev';
        this.nextClass = 'control-next';
        this.inactiveClass = ' inactive';
        
        this.init = function() {
            if ($(window).width() > 1280) {
                this.slidesVisible = 5;
            }
            this.setSlidesSize();
            this.addControls();
            this.setCurrentSlideSize();
            this.delegateEvents();
            this.setActiveSlideClass();
            readySliders++;
        }
                
        this.setSlidesSize = function() {
            this.setSlidesWidth();
            this.setSlidesHeight();
        }
        
        this.setSlidesWidth = function() {
            var slideWidthWithoutPadding = Math.floor(this.sliderDiv.width() * (1 / this.slidesVisible - 0.06));
            
            this.slidePadding = Math.floor(this.sliderDiv.width() * 0.03);                    
            this.slideWidth = this.sliderDiv.width() * 1 / this.slidesVisible;
            
            var _this = this;
            this.slides.each(function() {
                $(this).width(slideWidthWithoutPadding);
                $(this).css({'padding': _this.slidePadding + 'px'});
            });
            
            this.sliderUl.width(this.slidesCount * this.slideWidth);
        }
        
        this.setSlidesHeight = function() {
            var _this = this;
            
            _this.slides.each(function() {
                var thisHeight = $(this).height();
                _this.slideHeight = (thisHeight > _this.slideHeight) ? thisHeight : _this.slideHeight;
            });
            _this.slides.each(function() {
                $(this).height(_this.slideHeight);
            });
            _this.sliderDiv.height(_this.slideHeight + _this.slidePadding * 2);
        }
        
        this.setCurrentSlideSize = function() {    
            var width = Math.floor(this.presentationDiv.width() * 0.5 - 100);
            this.currentSlide.parent('.current-slide').width(width);
        }
                
        this.addControls = function() {        
            var nextClass = (this.slidesCount - this.active > this.slidesVisible) ? this.nextClass : this.nextClass + this.inactiveClass;
        
            $('<div></div>').attr('id', 'prev' + readySliders).addClass(this.prevClass + this.inactiveClass).insertBefore(this.sliderDiv);
            $('<div></div>').attr('id', 'next' + readySliders).addClass(nextClass).insertBefore(this.sliderDiv);
            var currentSildeContent = $('<div></div>').addClass('current-slide-content').attr('id', 'currentSlide' + readySliders);
            this.presentationCont.prepend($('<div></div>').addClass('current-slide').append(currentSildeContent));
            
            this.prev = $('#prev' + readySliders);
            this.next = $('#next' + readySliders);
            this.currentSlide = $('#currentSlide' + readySliders);
            
            var currentSlideHtml = $(this.slides[this.active]);
            this.setCurrentSlideHtml(currentSlideHtml);
        }
        
        this.delegateEvents = function() {
            var _this = this;
            
            _this.next.on('click', function() {
                if (_this.active + 1 < _this.slidesCount) {
                    _this.active++;
                    if (_this.prev.hasClass(_this.inactiveClass.trim())) {
                        _this.prev.removeClass(_this.inactiveClass.trim());
                    }             
                    if (_this.active == _this.slidesCount - 1) { 
                        _this.next.addClass(_this.inactiveClass.trim());
                    }
                    _this.changeSlide('next');
                }
            });
        
            _this.prev.on('click', function() {            
                if (_this.active > 0) {           
                    _this.active--;
                    if (_this.next.hasClass(_this.inactiveClass.trim())) {
                        _this.next.removeClass(_this.inactiveClass.trim());
                    }             
                    if (_this.active == 0) {           
                        _this.prev.addClass(_this.inactiveClass.trim());
                    }
                    _this.changeSlide('prev');
                }
            });
            
            _this.slides.on('click', function() {
                _this.active = _this.slides.index($(this));
                _this.changeSlide('click');
            });
        }
        
        this.setCurrentSlideHtml = function(element) {            
            this.currentSlide.html(element.html());
        }
        
        this.changeSlide = function(type) {
            if (type == 'click') {
                if (this.active == 0) {           
                    this.prev.addClass(this.inactiveClass.trim());
                }
                if (this.active == this.slidesCount - 1) { 
                    this.next.addClass(this.inactiveClass.trim());
                }
                if (this.active > 0 && this.active < this.slidesCount - 1) {
                    if (this.prev.hasClass(this.inactiveClass.trim())) {
                        this.prev.removeClass(this.inactiveClass.trim());
                    }             
                    if (this.next.hasClass(this.inactiveClass.trim())) {
                        this.next.removeClass(this.inactiveClass.trim());
                    }        
                }            
            }
            
            var marginLeft = -1 * this.slideWidth;
            if (this.active <= this.slidesCount - this.slidesVisible) {
                marginLeft *= this.active;
            } else {
                marginLeft *= this.slidesCount - this.slidesVisible;
            }
            this.sliderUl.animate({ 'marginLeft': marginLeft + 'px' }, 500);  
            
            this.setActiveSlideClass();
            var element = $(this.slides[this.active]);
            this.setCurrentSlideHtml(element);
            this.scrollToSlides();
        }
        
        this.setActiveSlideClass = function() {
            this.slides.removeClass('current');
            $(this.slides[this.active]).addClass('current');
        }
        
        this.scrollToSlides = function() {
            var slidesBottom = $(this.slides[this.active]).offset().top - ($(window).height() - (this.slideHeight + this.slidePadding * 2));
            $(window).scrollTop(slidesBottom);
        }
        
        this.resize = function() {
            this.setSlidesWidth();
            this.setCurrentSlideSize();
        }
    }
});