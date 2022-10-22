// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.currentHistoryIndex = 0;
window.currentHistoryIndexForBack = 0;
window.componentsHistory = [];
window.componentsHistoryForBack = [];

window.outlineElements = [];
window.selectedElementIndex = -1;
window.drawingComponents = [];
window.copyIndex = -1;
window.side = 0;
window.previewSide = 0;
window.scale = 1;

function fontSizeClicked(size) {
    if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
        $('#selected_font_size').val(size);
        window.drawingComponents[window.selectedElementIndex].changeTextFontSize(size);
        globalComponentChanged();
    }
}
function fontsizeChanged(element) {
    if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {

        window.drawingComponents[window.selectedElementIndex].changeTextFontSize(parseFloat(element.value));
        globalComponentChanged();
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
        if (window.selectedElementIndex != -1)
            window.drawingComponents[window.selectedElementIndex].changeRectCircleFillColor(colorStr);
    });

    $('#btn_shape_border_color>.selected-color').on('updated', function (event, colorStr) {
        $(event.target).attr('value', colorStr);
        if (window.selectedElementIndex!=-1)
            window.drawingComponents[window.selectedElementIndex].changeRectCircleBorderColor(colorStr);
    });

    $("#btn_image_rotate,.rotateRight").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].rotateElementRight();
        globalComponentChanged();
    });
    $(".rotateLeft").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].rotateElementLeft();
        globalComponentChanged();
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
                if ($(menuElement).hasClass('disabled'))
                    return;
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
                globalComponentChanged();
            });
        }).call(this);
    }
    for (var i = 0; i < $("#shape_border_width_menu .button-menu-text").length; i++) {
        (function () {
            $($("#shape_border_width_menu .button-menu-text")[i]).on('click', function (event) {

                var tempStr = event.target.innerHTML;
                var _value = parseFloat(tempStr.slice(0, tempStr.length - 2));
                window.drawingComponents[window.selectedElementIndex].imageBorderWeightChanged(_value);
                globalComponentChanged();
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

            globalComponentChanged();
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
    $("#inline_textarea").on('change', function () {
        globalComponentChanged();
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
                    globalComponentChanged();
                }
                startpos = -1;
                endpos = -1;
            });
        }).call(this);
    }
    

    $("#btn_text_bold").on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeFontWeight();
            globalComponentChanged();
        }
    });

    $("#btn_text_italic").on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeFontItalic();
            globalComponentChanged();
        }
    });
    $('#btn_text_gravity_west').on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeTextAlign('left');
            $('#btn_text_gravity_west').addClass('on');
            $('#btn_text_gravity_center').removeClass('on');
            $('#btn_text_gravity_east').removeClass('on');
            globalComponentChanged();
        }
    });

    $('#btn_text_gravity_center').on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeTextAlign('center');
            $('#btn_text_gravity_center').addClass('on');
            $('#btn_text_gravity_east').removeClass('on');
            $('#btn_text_gravity_west').removeClass('on');
            globalComponentChanged();
        }
    });

    $('#btn_text_gravity_east').on('click', function () {
        if (window.selectedElementIndex >= 0 && window.drawingComponents[window.selectedElementIndex].getType() == 'text') {
            window.drawingComponents[window.selectedElementIndex].changeTextAlign('right');
            $('#btn_text_gravity_east').addClass('on');
            $('#btn_text_gravity_center').removeClass('on');
            $('#btn_text_gravity_west').removeClass('on');
            globalComponentChanged();
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
        window.selectedElementIndex = -1;
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


var frontBackgroundColor = 'rgb(255, 255, 255)';
(function () {
    var newHistory = {};
    newHistory.type = 'backgroundColor';
    newHistory.backgroundColor = frontBackgroundColor;
    frontBackgroundColor = document.getElementById('canvas').style.backgroundColor;

    window.componentsHistory.splice(window.currentHistoryIndex, window.componentsHistory.length - window.currentHistoryIndex, newHistory);
    window.currentHistoryIndex++;

    window.componentsHistoryForBack.splice(window.currentHistoryIndexForBack, window.componentsHistoryForBack.length - window.currentHistoryIndexForBack, newHistory);
    window.currentHistoryIndexForBack++;
}).call(this);
function globalColorHistoryChanged() {
    var newHistory = {};
    if (document.getElementById('canvas').style.backgroundColor != frontBackgroundColor) {
        newHistory.type = 'backgroundColor';
        newHistory.backgroundColor = document.getElementById('canvas').style.backgroundColor;
        frontBackgroundColor = document.getElementById('canvas').style.backgroundColor;
        if (window.side == 0) {
            window.componentsHistory.splice(window.currentHistoryIndex, window.componentsHistory.length - window.currentHistoryIndex, newHistory);
            window.currentHistoryIndex++;
        }
        if (window.side == 1) {
            window.componentsHistoryForBack.splice(window.currentHistoryIndexForBack, window.componentsHistoryForBack.length - window.currentHistoryIndexForBack, newHistory);
            window.currentHistoryIndexForBack++;
        }
    } else {
        newHistory.type = 'componentChanged';
        newHistory.backgroundColor = document.getElementById('canvas').style.backgroundColor;
        newHistory.componentIndex = window.selectedElementIndex;
        if (window.selectedElementIndex != -1) {
            if (window.side == 0) {
                window.componentsHistory.splice(window.currentHistoryIndex, window.componentsHistory.length - window.currentHistoryIndex, newHistory);
                window.currentHistoryIndex++;                
            }
            if (window.side == 1) {
                window.componentsHistoryForBack.splice(window.currentHistoryIndexForBack, window.componentsHistoryForBack.length - window.currentHistoryIndexForBack, newHistory);
                window.currentHistoryIndexForBack++;
            }
            window.drawingComponents[window.selectedElementIndex].saveAttributesToHistory();
        }
    }
    checkForEditButtons();
}

function colorPickerHided() {
    globalColorHistoryChanged();
}


function globalComponentChanged() {
    var newHistory = {};
    if (window.selectedElementIndex != -1) {
        newHistory.componentIndex = window.selectedElementIndex;
        newHistory.type = 'componentChanged';
        newHistory.backgroundColor = document.getElementById('canvas').style.backgroundColor;
        if (window.side == 0) {
            window.componentsHistory.splice(window.currentHistoryIndex, window.componentsHistory.length - window.currentHistoryIndex, newHistory);
            window.currentHistoryIndex++;
        }
        if (window.side == 1) {
            window.componentsHistoryForBack.splice(window.currentHistoryIndexForBack, window.componentsHistoryForBack.length - window.currentHistoryIndexForBack, newHistory);
            window.currentHistoryIndexForBack++;
        }
        window.drawingComponents[window.selectedElementIndex].saveAttributesToHistory();
    }
    checkForEditButtons();
}

function globalComponentCreated() {
    var newHistory = {};
    newHistory.componentIndex = window.drawingComponents.length-1;
    newHistory.type = 'componentCreated';
    newHistory.backgroundColor = document.getElementById('canvas').style.backgroundColor;

    if (window.side == 0) {
        window.componentsHistory.splice(window.currentHistoryIndex, window.componentsHistory.length - window.currentHistoryIndex, newHistory);
        window.currentHistoryIndex++;
    }
    if (window.side == 1) {
        window.componentsHistoryForBack.splice(window.currentHistoryIndexForBack, window.componentsHistoryForBack.length - window.currentHistoryIndexForBack, newHistory);
        window.currentHistoryIndexForBack++;
    }
    
    window.drawingComponents[newHistory.componentIndex].saveAttributesToHistory();

    checkForEditButtons();
}


/////edit buttons part
function checkForEditButtons() {
    if (((window.currentHistoryIndex >= 2) && window.side == 0) || ((window.currentHistoryIndexForBack >= 2) && window.side == 1))
        $("#btn_edit_undo").removeClass('disabled');
    else $("#btn_edit_undo").addClass('disabled');

    if (((window.currentHistoryIndex < window.componentsHistory.length) && window.side == 0) || ((window.currentHistoryIndexForBack < window.componentsHistoryForBack.length) && window.side == 1))
        $("#btn_edit_redo").removeClass('disabled');
    else $("#btn_edit_redo").addClass('disabled');
}
(function () {
    $("#btn_edit_paste").addClass('disabled');
    $("#btn_edit_lock").addClass('disabled');
    $("#btn_edit_delete").addClass('disabled');
    $("#btn_edit_redo").addClass('disabled');
    $("#btn_edit_undo").addClass('disabled');
    $("#btn_edit_copy").addClass('disabled');
    $("#btn_edit_paste").on('click', function () {
        if ($("#btn_edit_paste").hasClass('disabled'))
            return;
        if (window.copyIndex == -1)
            return;
        
        var options = window.drawingComponents[window.copyIndex].copyAttributeValues();
        BasicComponent(options.type, options.arg1);
        window.drawingComponents[window.drawingComponents.length - 1].getAttributesFromValues(options);
    });
    $("#btn_edit_copy").on('click', function () {
        if ($("#btn_edit_copy").hasClass('disabled'))
            return;
        copyIndex = window.selectedElementIndex;
        $("#btn_edit_paste").removeClass('disabled');
    });
    $("#btn_edit_lock").on('click', function () {
        if ($("#btn_edit_lock").hasClass('disabled'))
            return;
        if (window.selectedElementIndex >= 0) {
            window.drawingComponents[window.selectedElementIndex].lockComponent();
        }
    });
    $("#btn_edit_undo").on('click', function () {
        if ($("#btn_edit_undo").hasClass('disabled'))
            return;
        if ((window.currentHistoryIndex <= 0 && window.side == 0) || (window.currentHistoryIndexForBack <= 0 && window.side == 1))
            return;
        
        if (window.currentHistoryIndex >= 1 && window.side == 0) {
            if (window.componentsHistory[window.currentHistoryIndex - 1].type == "backgroundColor") {
                $("#canvas").css({ backgroundColor: window.componentsHistory[window.currentHistoryIndex - 2].backgroundColor });
            }
            else {
                $("#canvas").css({ backgroundColor: window.componentsHistory[window.currentHistoryIndex - 2].backgroundColor });
                window.drawingComponents[window.componentsHistory[window.currentHistoryIndex - 1].componentIndex].moveToPrevHistoryState();
            }
            window.currentHistoryIndex--;
        }

        if (window.currentHistoryIndexForBack >= 1 && window.side == 1) {
            if (window.componentsHistoryForBack[window.currentHistoryIndexForBack - 1].type == "backgroundColor") {
                $("#canvas").css({ backgroundColor: window.componentsHistoryForBack[window.currentHistoryIndexForBack - 2].backgroundColor });
            }
            else {
                $("#canvas").css({ backgroundColor: window.componentsHistoryForBack[window.currentHistoryIndexForBack - 2].backgroundColor });
                window.drawingComponents[window.componentsHistoryForBack[window.currentHistoryIndexForBack - 1].componentIndex].moveToPrevHistoryState();
            }
            window.currentHistoryIndexForBack--;
        }
        checkForEditButtons();
    });
    $("#btn_edit_redo").on('click', function () {
        if ($("#btn_edit_redo").hasClass('disabled'))
            return;
        if (((window.currentHistoryIndex >= window.componentsHistory.length) && window.side == 0) || ((window.currentHistoryIndexForBack >= window.componentsHistoryForBack.length) && window.side == 1))
            return;
        if (window.side == 0) {
            if (window.currentHistoryIndex < window.componentsHistory.length) {
                if (window.componentsHistory[window.currentHistoryIndex].type == "backgroundColor") {

                } else {
                    window.drawingComponents[window.componentsHistory[window.currentHistoryIndex].componentIndex].moveToNextHistoryState();
                }
                $("#canvas").css({ backgroundColor: window.componentsHistory[window.currentHistoryIndex].backgroundColor });
            }

            window.currentHistoryIndex++;
        }
        if (window.side == 1) {
            if (window.currentHistoryIndexForBack < window.componentsHistoryForBack.length) {
                if (window.componentsHistoryForBack[window.currentHistoryIndexForBack].type == "backgroundColor") {

                } else {
                    window.drawingComponents[window.componentsHistoryForBack[window.currentHistoryIndexForBack].componentIndex].moveToNextHistoryState();
                }
                $("#canvas").css({ backgroundColor: window.componentsHistoryForBack[window.currentHistoryIndexForBack].backgroundColor });
            }

            window.currentHistoryIndexForBack++;
        }
        checkForEditButtons();
    });

}).call(this);

////for advanced part
(function () {
    $("#btn_advance_align").addClass('disabled');
    $("#btn_advance_layers").addClass('disabled');
    $("#btn_advance_rotate").addClass('disabled');
    $("#btn_advance_crop").addClass('disabled');

    $("#btn_align_left").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].alignLeft();
        globalComponentChanged();
    });
    $("#btn_align_center").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].alignCenter();
        globalComponentChanged();

    });
    $("#btn_align_right").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].alignRight();
        globalComponentChanged();
    });
    $("#btn_align_top").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].alignTop();
        globalComponentChanged();
    });
    $("#btn_align_middle").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].alignMiddle();
        globalComponentChanged();
    });
    $("#btn_align_bottom").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].alignBottom();
        globalComponentChanged();
    });
    $("#btn_dist_ver").on('click', function () {

    });
    $("#btn_dist_hor").on('click', function () {

    });


    $("#btn_arrange_bring_front").on('click', function () {
        if ($("#btn_advance_layers").hasClass('disabled'))
            return;
        window.drawingComponents[window.selectedElementIndex].bringToFront();
    });
    $("#btn_arrange_send_back").on('click', function () {
        if ($("#btn_advance_layers").hasClass('disabled'))
            return;
        window.drawingComponents[window.selectedElementIndex].sendToBack();
    });
    $("#btn_arrange_bring_forward").on('click', function () {
        if ($("#btn_advance_layers").hasClass('disabled'))
            return;
        window.drawingComponents[window.selectedElementIndex].bringForward();
    });
    $("#btn_arrange_send_backward").on('click', function () {
        if ($("#btn_advance_layers").hasClass('disabled'))
            return;
        window.drawingComponents[window.selectedElementIndex].sendBackward();
    });
    $("#btn_advance_rotate").on('click', function () {
        window.drawingComponents[window.selectedElementIndex].rotateElementRight();
        globalComponentChanged();
    });


    $("#page_navigation_0").on('click', function () {
//        if ($("#page_navigation_0").hasClass('on'))
//            return;
        window.side = 0;
        $("#page_navigation_0").addClass('on');
        $("#page_navigation_1").removeClass('on');

        changeSide();
    });

    $("#page_navigation_1").on('click', function () {
//        if ($("#page_navigation_1").hasClass('on'))
//            return;
        window.side = 1;
        $("#page_navigation_1").addClass('on');
        $("#page_navigation_0").removeClass('on');
        changeSide();
    });
    var canvas1, canvas2;
    $("#btn_preview").on('click', async function (event) {
//        $("#mask_layers").css({ visibility: 'hidden' });

        $("#main_content").css({ visibility: 'visible' });
        for (var i = 0; i < window.outlineElements.length; i++) {
            $(window.outlineElements[i]).trigger('unselected');
        }
        $("#page_navigation_0").addClass('on');
        $("#page_navigation_1").removeClass('on');
        window.previewSide = 0;

        var tempside = window.side;
        if (window.side == 0) {
            canvas1 = await html2canvas(document.querySelector("#canvas"));
            window.side = 1;
            changeSide();
            canvas2 = await html2canvas(document.querySelector("#canvas"));
            $(".overlay-vistool").html(canvas1);
        } else {
            canvas2 = await html2canvas(document.querySelector("#canvas"));
            window.side = 0;
            changeSide();
            canvas1 = await html2canvas(document.querySelector("#canvas"));
            $(".overlay-vistool").html(canvas1);
        }

        window.side = tempside;
        changeSide();
    });

    $("#preview_nav_0").on('click', async function () {
//        if ($("#preview_nav_0").hasClass('on'))
//            return;
        $("#preview_nav_0").addClass('on');
        $("#preview_nav_1").removeClass('on');

        $({ deg: 0 }).animate({ deg: 90 }, {
            duration: 2000,
            easing: "linear",
            step: function (now) {
                $("canvas").css({
                    transform: 'rotate3d(0,1,0,' + now + 'deg)'
                });
            },
        });
        setTimeout(
            function () {
                $(".overlay-vistool").html(canvas1);
                $({ deg: 90 }).animate({ deg: 0 }, {
                    duration: 2000,
                    easing: "linear",
                    step: function (now) {
                        $("canvas").css({
                            transform: 'rotate3d(0,1,0,' + now + 'deg)'
                        });
                    },
                    //            complete: complete || $.noop
                });
            }
            , 2000);
    });
    $("#preview_nav_1").on('click', async function () {
//        if ($("#preview_nav_1").hasClass('on'))
//            return;
        $("#preview_nav_1").addClass('on');
        $("#preview_nav_0").removeClass('on');

        $({ deg: 0 }).animate({ deg: 90 }, {
            duration: 2000,
            easing: "linear",
            step: function (now) {
                $("canvas").css({
                    transform: 'rotate3d(0,1,0,' +  now + 'deg)'
                });
            },
        });
        setTimeout(
            function () {
                $(".overlay-vistool").html(canvas2);
                $({ deg: 90 }).animate({ deg: 0 }, {
                    duration: 2000,
                    easing: "linear",
                    step: function (now) {
                        $("canvas").css({
                            transform: 'rotate3d(0,1,0,' + now + 'deg)'
                        });
                    },
                    //            complete: complete || $.noop
                });
            }
            , 2000);
    });

}).call(this);

function changeSide() {
    window.selectedElementIndex = -1;
    for (var i = 0; i < window.drawingComponents.length; i++) {
        window.drawingComponents[i].changingSide();
    }

    if (window.side == 0) {
        $("#page_navigation_0").addClass('on');
        $("#page_navigation_1").removeClass('on');
        $("#canvas").css({ backgroundColor: window.componentsHistory[window.currentHistoryIndex - 1].backgroundColor });
    }
    if (window.side == 1) {
        $("#canvas").css({ backgroundColor: window.componentsHistoryForBack[window.currentHistoryIndexForBack - 1].backgroundColor });
        $("#page_navigation_1").addClass('on');
        $("#page_navigation_0").removeClass('on');
    }
    checkForEditButtons();
    window.selectedElementIndex = -1;
}


////related to crop tool bar
//$("#crop_toolbar").css({ display: 'block' });
(function () {
    $("#btn_image_crop,#btn_advance_crop").on('click', function () {
        if (window.selectedElementIndex != -1) {
            window.drawingComponents[window.selectedElementIndex].showCropImageToolbars();
        }
    });
    
}).call(this);


window.addEventListener("scroll", (event) => {
    let scroll = this.scrollY;
    if (scroll > 55)
        $("#top_toolbar_placeholder").css({ position: 'sticky', top: '70px' });
    else $("#top_toolbar_placeholder").css({ position: 'relative', top: '0px' });

//    if (this.scrollx > 0) {
//        $('body').css({ marginLeft: this.scrollX + 'px' });
//    }
});
