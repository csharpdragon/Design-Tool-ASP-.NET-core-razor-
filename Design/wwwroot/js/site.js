// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.componentsHistory = [];
window.outlineElements = [];
window.selectedElementIndex = -1;
window.drawingComponents = [];
function fontSizeClicked(size) {
    if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
        $('#selected_font_size').val(size);
        window.drawingComponents[window.selectedElementIndex].changeTextFontSize(size);
    }
}
function fontsizeChanged(element) {
    if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {

        window.drawingComponents[window.selectedElementIndex].changeTextFontSize(parseFloat(element.value));
    }
}

function imgSelectedOnModal(e) {
    if (!$(".image" + e).hasClass('imgSelected'))
        $(".image" + e).addClass('imgSelected');
    else $(".image" + e).removeClass('imgSelected');
}

(function () {
    $('#selected_font_color').on('updated',
        function (objectEvent, colorStr) {
            if (selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
                window.drawingComponents[window.selectedElementIndex].changeTextFontColor(colorStr);
            }
        });
    $('#selected_bg_color').on('updated',
        function (objectEvent, colorStr) {
            $("#canvas").css({ backgroundColor: colorStr });
        });
    $('#btn_image_border_color>.selected-color').on('updated', function (event, _value) {
            if (selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'image') {
                $(event.target).attr('value', _value);
                window.drawingComponents[window.selectedElementIndex].imgBorderColorChanged(_value);
            }
        });

    $('#btn_shape_fill_color>.selected-color').on('updated', function (event, colorStr) {
        $(event.target).attr('value', colorStr);
        window.drawingComponents[window.selectedElementIndex].changeRectCircleFillColor(colorStr);
    });
    $('#btn_shape_border_color>.selected-color').on('updated', function (event, colorStr) {
        $(event.target).attr('value', colorStr);
        window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderColor(colorStr);
    });

}).call(this);
jscolor.presets.default = {
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26', '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d', '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ],
}
function update(picker) {
    console.log(picker.toBackground());
}
function fontsizebuttonClicked() {
    $("#btn_text_font_size").addClass('open');
    console.log("btn_text_font_size");
}
(function () {
    for (var i = 0; i < $('.menu-opener').length; i++) {
        (function () {
            var menuElement = $('.menu-opener')[i];
            $($('.menu-opener')[i]).on('click', function (event) {

                if (event.target.parentElement.classList.contains("image-border-width-option")) {
                    $(menuElement).removeClass('open');
                    return;
                }
                if (event.target.parentElement.id =="shape_border_stroke_menu") {
                    $(menuElement).removeClass('open');
                    return;
                }
                if (event.target.parentElement.parentElement.classList.contains('button-menu') || event.target.parentElement.classList.contains('button-menu')) {
                    $(menuElement).removeClass('open');
                    return;
                }
               
                    
                else $(menuElement).addClass('open');
            });

            $(window).on('click', function (event) {
                if ($(menuElement).find(event.target).length == 0) {
                    $(menuElement).removeClass('open');
                }
            });
        }).call(this);
    }
    for (var i = 0; i < $("#image_border_width_menu .button-menu-text").length; i++) {
        (function () {
            $($("#image_border_width_menu .button-menu-text")[i]).on('click', function (event) {
                var tempStr = event.target.innerHTML;
                var _value = parseFloat(tempStr.slice(0, tempStr.length - 2));
                window.drawingComponents[window.selectedElementIndex].borderWeightChanged(_value);
            });
        }).call(this);
    }
    for (var i = 0; i < $("#shape_border_width_menu .button-menu-text").length; i++) {
        (function () {
            $($("#shape_border_width_menu .button-menu-text")[i]).on('click', function (event) {

                var tempStr = event.target.innerHTML;
                var _value = parseFloat(tempStr.slice(0, tempStr.length - 2));
                window.drawingComponents[window.selectedElementIndex].imageBorderWeightChanged(_value);
            });
        }).call(this);
    }

    $('#shape_border_stroke_solid, #shape_border_stroke_round_dot, #shape_border_stroke_square_dot, #shape_border_stroke_dash, #shape_border_stroke_dash_dot, #shape_border_stroke_long_dash, #shape_border_stroke_long_dash_dot').on('click',
        function (event) {
            switch (event.target.id) {
                case 'shape_border_stroke_solid':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(0);
                    break;
                case 'shape_border_stroke_round_dot':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(1);
                    break;
                case 'shape_border_stroke_square_dot':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(2);

                    break;
                case 'shape_border_stroke_dash':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(3);

                    break;
                case 'shape_border_stroke_dash_dot':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(4);

                    break;
                case 'shape_border_stroke_long_dash':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(5);

                    break;
                case 'shape_border_stroke_long_dash_dot':
                    window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderType(6);

                    break;
            }
//            $($(event.target).parent().parent()).removeClass('open');
//            $($(event.target).parent().parent()).removeClass('open');
        }
    );

}).call(this);
(function () {
    $("#btn_text_done").on('click', function () {
            $(".ui-draggable").removeClass('open');
            $(".ui-draggable").addClass('close');
        window.drawingComponents[window.selectedElementIndex].changedUiDragTool();
    });
    $("#btn_text_edit").on('click', function () {
        $(".ui-draggable").addClass('open');
        $(".ui-draggable").removeClass('close');
        window.drawingComponents[window.selectedElementIndex].changedUiDragTool();
    });
    $("#inline_textarea").on('input', function () {
        window.drawingComponents[window.selectedElementIndex].getInputchanged($("#inline_textarea").val());
    });
    var draggableItems = document.getElementsByClassName('ui-draggable');
    for (var i = 0; i < draggableItems.length; i++) {
        
        (function () {
            var dragItem = draggableItems[i];
            var startposy = -1, startposx = -1,  endposx=-1, endposy=-1;
            startposx = dragItem.getBoundingClientRect().left;
            startposy = dragItem.getBoundingClientRect().top;
            var started = false;
            $(dragItem).on('mousedown', function (event) {
                if (event.target.id == 'inline_textarea')
                    return;
                started = true;
                endposx = event.pageX;
                endposy = event.pageY;
            });
            $(window).on('mousemove', function (event) {
                if (started) {
                    $(dragItem).css({
                        left: "+="+(event.pageX - endposx) ,
                        top: "+=" + (event.pageY - endposy),
                    });
                    endposx = event.pageX;
                    endposy = event.pageY;
                }
            });
            $(window).on('mouseup', function (event) {
                started = false;
            });
        }).call(this);
    }
    $("#textbox_tools").hide();
}).call(this);
(function () {
    var SliderControl, elements = $(".opacity-feature");//opacity-slider-handle
    for (var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
        (function () {
            var currentvalue = 100;
            var currentElement = elements[elementIndex];
            var opacity_slider_handle = $(currentElement).find('.opacity-slider-handle');
            var startpos = -1, endpos = -1;
            var mousemoving = false;

            $(currentElement).on('initopacity', function (_obj, _value) {
                $(opacity_slider_handle).css({ top: (100-_value) * 1.3 + 'px' });
                $(currentElement).find('.opacity-value-indicator').html(_value);
            });

            $(currentElement).find('.opacity-range-bar').on('click', function (event) {
                if (mousemoving) {
                    mousemoving = false; return;
                }
                currentvalue = 100 - Math.floor((event.offsetY - 6) / 1.3);
                $(opacity_slider_handle).css({ top: Math.floor((event.offsetY - 6) / 1.3) *1.3+'px' });
                $(currentElement).find('#selected_text_opacity').trigger('updated', currentvalue);
                $(currentElement).find('.opacity-value-indicator').trigger('updated', currentvalue);
            });

            $(currentElement).find('#selected_text_opacity').on('updated',
                function (objectEvent, value) {
                    $(currentElement).find('#selected_text_opacity').attr('value', value);
                    $(currentElement).find('#selected_text_opacity').html(value);
                    if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
                        window.drawingComponents[window.selectedElementIndex].changeTextOpacity(value);
                    }
                }
            );
            $(currentElement).find('.opacity-value-indicator').on('updated',
                function (objectEvent, value) {
                    $(currentElement).find('.opacity-value-indicator').html(value);
                    if ($(currentElement).find('#image_opacity,#shape_opacity').length != 0) {
                       
                        if (window.selectedElementIndex != -1) {
                            window.drawingComponents[window.selectedElementIndex].opacityChanged(value);
                        }
                    }
                }
            );
            $(opacity_slider_handle).on('mousedown', function (event) {
                startpos = event.pageY;
            });

            $(window).on('mousemove', function (event) {
                if (startpos == -1)
                    return;
                var reverseCurrentValue = 100 - currentvalue;
                if (event.pageY - startpos + reverseCurrentValue * 1.3 >= 0 && event.pageY - startpos + reverseCurrentValue * 1.3 <= 130) 
                    endpos = event.pageY;
                if (event.pageY - startpos + reverseCurrentValue * 1.3 > 130)
                    endpos = 130 + startpos - reverseCurrentValue * 1.3;
                if (event.pageY - startpos + reverseCurrentValue * 1.3 < 0)
                    endpos = startpos - reverseCurrentValue * 1.3;
                if (endpos == -1)
                    return;
                mousemoving = true;
                $(opacity_slider_handle).css({ top: Math.floor((endpos - startpos + reverseCurrentValue * 1.3) / 1.3) * 1.3 + 'px' });
                $(currentElement).find('#selected_text_opacity').trigger('updated', 100 - Math.floor((endpos - startpos + reverseCurrentValue * 1.3) / 1.3));
                $(currentElement).find('.opacity-value-indicator').trigger('updated', 100 - Math.floor((endpos - startpos + reverseCurrentValue * 1.3) / 1.3));
            });
            $(window).on('mouseup', function (event) {
                if (startpos != -1) {

                    currentvalue = 100 - Math.floor((endpos - startpos + (100 - currentvalue) * 1.3) / 1.3);
                    currentvalue = currentvalue > 100 ? 100 : currentvalue;
                    currentvalue = currentvalue < 0 ? 0 : currentvalue;
                }
                startpos = -1;
                endpos = -1;
            });
        }).call(this);
    }
    

    $("#btn_text_bold").on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeFontWeight();
        }
    });

    $("#btn_text_italic").on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeFontItalic();
        }
    });
    $('#btn_text_gravity_west').on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeTextAlign('left');
            $('#btn_text_gravity_west').addClass('on');
            $('#btn_text_gravity_center').removeClass('on');
            $('#btn_text_gravity_east').removeClass('on');
        }
    });

    $('#btn_text_gravity_center').on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeTextAlign('center');
            $('#btn_text_gravity_center').addClass('on');
            $('#btn_text_gravity_east').removeClass('on');
            $('#btn_text_gravity_west').removeClass('on');
        }
    });

    $('#btn_text_gravity_east').on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeTextAlign('right');
            $('#btn_text_gravity_east').addClass('on');
            $('#btn_text_gravity_center').removeClass('on');
            $('#btn_text_gravity_west').removeClass('on');
        }
    });
    $(".InsertBtnOnModal").on('click', function () {
        
        for (var i = 0; i < $('.viewImage').length; i++) {
            if ($($('.viewImage')[i]).attr('class').indexOf('imgSelected')>=0)
               BasicComponent('image', 'Files/' + window.ImageInfoList[i].name)
        }
        $('#exampleModalCenter').modal('hide');
    });
    $("#insert_user_text").on('click', function () {
        BasicComponent('text', 'New Text Input ...');

    });
    $("#btn_preview").on('click', function (event) {
        $("#mask_layers").css({ visibility: 'hidden' });

        $("#main_content").css({ visibility: 'visible' });
        for (var i = 0; i < window.outlineElements.length; i++) {
            $(window.outlineElements[i]).trigger('unselected');
        }
        html2canvas(document.querySelector("#canvas")).then(canvas => {
           
            $(".overlay-vistool").html(canvas);
            $("#mask_layers").css({ visibility: 'visible' });
            
        });
    });

    $("#preview_bar>.toolbar-button").on('click', function () {
        $("#main_content").css({ visibility: 'hidden' });
    });
    $(".insertAndUploadBtn").on('click', function () {
        for (var i = 0; i < window.outlineElements.length; i++) {
            $(window.outlineElements[i]).trigger('unselected');
        }
        $('#exampleModalCenter').modal('show');
        var selectedItems = $('.imgSelected');
        for (var i = 0; i < selectedItems.length; i++) {
            $(selectedItems[i]).removeClass('imgSelected');
        }
    });

    $("#btn_shape_rect,#btn_shape_circle,#btn_shape_hline,#btn_shape_vline").on('click', function (event) {
        var tempId = event.target.parentElement.id;
        var type = '';
        if (tempId == "btn_shape_rect") {
            type = 'rect';
        }
        if (tempId == "btn_shape_circle") {
            type = 'circle';
        }
        if (tempId == "btn_shape_hline") {
            type = 'hline';
        }
        if (tempId == "btn_shape_vline") {
            type = 'vline';
        }
        BasicComponent(type);
        $("#btn_shape_rect").parent().parent().removeClass('open');
    });
}).call(this);

window.addEventListener('click', (event) => {

    ///////////for image toolbar
    $("#btn_image_opacity").on('click', function () {
        $("#btn_image_opacity").addClass('open');
    });

    var Id = $(event.srcElement).attr('id');

    if (Id == 'selected_text_opacity') {
        $("#selected_text_opacity").parent().parent().addClass('open');
        return;
    }

    if (Id != 'fontArrow')
        $("#btn_text_font_size").removeClass('open');

    if ($('.opacity-feature').find(event.target).length == 0) {
        $(".opacity-feature").removeClass('open');
    }


    
})


