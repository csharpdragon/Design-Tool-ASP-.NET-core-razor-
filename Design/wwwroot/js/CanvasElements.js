window.outlineElements = [];
window.selectedElementIndex = -1;
window.drawingComponents = [];
window.componentsHistory = [];
function BasicComponent(type, arg1) {

    var historyRecord = [];

    var functionalElement;

    var elementIndexIndrawingElements;
    //////
    var allComponentTypes = { image: 'image', text: 'text', rect: 'rect', circle: 'circle', hline: 'hline', vline:'vline' };

    var element = null;  /////element entity
    var outlineElement = null; ////used for border

    var isSelected = false;

    ////relative to css
    var left, right, top, bottom;
    /////
    var width, height;

    ////in case of image
    this.compoenetType = type;


    /////elements in outlineElements
    var circleDotElements = [];
    var dotElementClicked = false;
    functionalElement = {
        saveAttributesToHistory() {
            var oneRecord = {};
            if (historyRecord.length == 0)
                oneRecord.changeType = 'create';
            else
                oneRecord.changeType = 'modify';
            oneRecord.type = type;
            oneRecord.opacity = element.style.opacity;
            oneRecord.fontStyle = element.style.fontStyle;
            oneRecord.fontWeight = element.style.fontWeight;
            oneRecord.textAlign = element.style.textAlign;
            oneRecord.TextContent = $(element).html();
            oneRecord.elementColor = element.style.color;
            oneRecord.elementFontSize = element.style.fontSize;
            oneRecord.RectCircleBorderColor = element.style.borderColor;
            oneRecord.RectCircleFillColor = element.style.backgroundColor;
            oneRecord.RectCircleBorderStyle = element.style.borderStyle;
            oneRecord.width = width; oneRecord.height = height;
            oneRecord.top = top; oneRecord.left = left;
            if (oneRecord.changeType == 'modify') {
                var previousHistory = historyRecord[historyRecord.length - 1];
                if (
                    oneRecord.type == previousHistory.type &&
                    oneRecord.opacity == previousHistory.opacity &&
                    oneRecord.fontStyle == previousHistory.fontStyle &&
                    oneRecord.fontWeight == previousHistory.fontWeight &&
                    oneRecord.textAlign == previousHistory.textAlign &&
                    oneRecord.TextContent == previousHistory.TextContent &&
                    oneRecord.elementColor == previousHistory.elementColor &&
                    oneRecord.elementFontSize == previousHistory.elementFontSize &&
                    oneRecord.RectCircleBorderColor == previousHistory.RectCircleBorderColor &&
                    oneRecord.RectCircleFillColor == previousHistory.RectCircleFillColor &&
                    oneRecord.width == previousHistory.width &&
                    oneRecord.height == previousHistory.height &&
                    oneRecord.top == previousHistory.top &&
                    oneRecord.left == previousHistory.left
                )
                    return;
            }
            historyRecord.push(oneRecord);
            console.log(historyRecord);
        },
        borderWeightChanged: function (_value) {
            if (type == allComponentTypes.image) {
                $($(element).find('div')[1]).css({ borderWidth: _value + 'px' });
            }
        },
        imageBorderWeightChanged: function (_value) {
            if (type == allComponentTypes.rect || type == allComponentTypes.circle) {
                $(element).css({ borderWidth: _value + 'px' });
            }
        },
        imgBorderColorChanged: function (_value) {
            if (type == allComponentTypes.image) {
                $($(element).find('div')[1]).css({ borderColor: _value });
            }
            if (type == allComponentTypes.text) {
                $(element).css({ color: _value });
            }
        },
        opacityChanged: function (_value) {
            if (type == allComponentTypes.image) {
                $($(element).find('div')[0]).css({ opacity: _value * 1.0 / 100 });
            }
            if (type == allComponentTypes.rect || type == allComponentTypes.circle) {
                $(element).css({ opacity: _value * 1.0 / 100 });
            }
            if (type == allComponentTypes.text) {
                $(element).css({ opacity: _value * 1.0 / 100 });
            }
        },
        changeTextOpacity: function (_value) {
            element.style.opacity = _value*1.0/100;
        },
        changeFontItalic: function () {
            if (element.style.fontStyle == 'italic') {
                element.style.fontStyle = 'normal';
                $("#btn_text_italic").removeClass('on');
            } else {
                $("#btn_text_italic").addClass('on');
                element.style.fontStyle = 'italic';
            }
        },
        changeFontWeight: function () {
            if (element.style.fontWeight == 'bold') {
                element.style.fontWeight = 'normal';
                $("#btn_text_bold").removeClass('on');
            } else {
                $("#btn_text_bold").addClass('on');
                element.style.fontWeight = 'bold';
            }
        },
        changeTextAlign: function (_value) {
            element.style.textAlign = _value;
        },
        getInputchanged: function (_value) {
            $(element).html(_value);
            
            widthOrHeightChanged();
        },
        getType:function() {
            return type;
        },
        changedUiDragTool: function () {
            widthOrHeightChanged();
        },
        changeTextFontColor: function (_value) {
            $(element).css({ color: _value });  
        },
        changeTextFontSize: function (_value) {
            $(element).css({ fontSize: _value });
            widthOrHeightChanged();
        },
        changeRectCircleFillColor: function (_value) {
            $(element).css({ backgroundColor: _value });
        },
        changeRectCircleBorderColor: function (_value) {
            $(element).css({ borderColor: _value });
        },
        changeRectCircleBorderType: function (_type) {
            switch (_type) {
                case 0:
                    $(element).css({ borderStyle: 'solid' });
                    break;
                case 1:
                    $(element).css({ borderStyle: 'dotted' });
                    break;
                case 2:
                    $(element).css({ borderStyle: 'dashed' });
                    break;
                case 3:
                    $(element).css({ borderImage: 'url("/images/easy/dash.png") 30 / 19px round' });

                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
            }
        }
    }

    function addEventListeners() {
        $("#canvas").on('click', function (event) {
            if ($(event.target).attr('id') == 'deselector') {
                for (var i = 0; i < window.outlineElements.length; i++) {
                    $(window.outlineElements[i]).trigger('unselected');
                    hideImageToolbars();
                }
                window.selectedElementIndex = -1;
            }
        });

        $(outlineElement).on('unselected', function () {
            unselected();
        });
        var originWidth = width, originHeight = height;
        
        var dstartPosX = -1, dendPosX = -1, dstartPosY = -1, dendPosY = -1;
        function dotEvent(dindex) {
            var originTop = -1, originLeft = -1;    
            var dotIndex = dindex;
            
            var thisDotclicked = false;
            function resizeDotElement() {
                if (type == allComponentTypes.image || type == allComponentTypes.rect || type == allComponentTypes.circle) {
                    if (dotIndex == 0 || dotIndex == 1 || dotIndex == 2) {
                        height = originHeight - dendPosY + dstartPosY;
                        top = height >= 5 ? originTop - (dstartPosY - dendPosY) : originTop - (5 - originHeight);
                    }
                    if (dotIndex == 4 || dotIndex == 5 || dotIndex == 6) {
                        height = originHeight + dendPosY - dstartPosY;
                    }
                    if (dotIndex == 2 || dotIndex == 3 || dotIndex == 4) {
                        width = originWidth + dendPosX - dstartPosX;

                    }
                    if (dotIndex == 6 || dotIndex == 7 || dotIndex == 0) {
                        width = originWidth - dendPosX + dstartPosX;
                        left = width > 5 ? originLeft - (dstartPosX - dendPosX) : originLeft - (5 - originWidth);
                    }
                }
                if (type == allComponentTypes.text) {
                    if (dotIndex == 0) {
                        width = originWidth - dendPosX + dstartPosX;
                        left = width > 5 ? originLeft - (dstartPosX - dendPosX) : originLeft - (5 - originWidth);
                    } else {
                        width = originWidth + dendPosX - dstartPosX;
                    }
//                    $(outlineElement).css({ height: element.getBoundingClientRect().height + 'px' });

                }
                widthOrHeightChanged();
            }
            $(circleDotElements[i]).on('mousedown', function (event) {
                dotElementClicked = true;
                thisDotclicked = true;
                originTop = top;
                originLeft = left;
                dstartPosX = event.pageX, dstartPosY = event.pageY;
            });
            $(window).on('mouseup', function (event) {
                
                dstartPosX = -1; dendPosX = -1; dstartPosY = -1; dendPosY = -1;

                if (thisDotclicked == false || dotElementClicked == false)
                    return;

                showImageToolbars();
                originTop = -1;
                originLeft = -1;
                originWidth = width >= 5 ? width : 5;;
                originLeft = left;
                originHeight = height >= 5 ? height : 5;
                originTop = top;
                dotElementClicked = false;
                thisDotclicked = false;
                
            });
            $(window).on('mousemove', function (event) {
                if (thisDotclicked == false || dstartPosX == -1 || dotElementClicked == false)
                    return;
                dendPosX = event.pageX, dendPosY = event.pageY;
                resizeDotElement();
            });
        }
        ////for dot elements
        for (var i = 0; i < circleDotElements.length; i++) {
                dotEvent(i);
        }
    }
    function createElement() {
        var canvasRect = document.getElementById('canvas').getBoundingClientRect();
        element = document.createElement('div');
        outlineElement = document.createElement('div');
        if (type == allComponentTypes.circle) {
            $(outlineElement).css({ width: width + 'px', height: height + 'px', position: 'absolute', zIndex: 500 });
             $(element).css({ borderRadius:'50%',width: width + 'px', height: height + 'px', position: 'absolute', backgroundColor: 'rgb(253, 246, 187)', border: '5px solid #888' });
            outlineElement.style.top = 0; outlineElement.style.left = 0;
            $(outlineElement).addClass('outlineElement');
            top = 0; left = 0;
            $("#outline_layers").append(outlineElement);
            $("#image_layers").append(element);

            elementIndexIndrawingElements = window.outlineElements.length;
            
        }
        if (type == allComponentTypes.rect) {

            $(outlineElement).css({ width: width + 'px', height: height + 'px', position: 'absolute', zIndex: 500 });
            $(element).css({ width: width + 'px', height: height + 'px', position: 'absolute', backgroundColor:'rgb(253, 246, 187)',border:'5px solid #888' });

            outlineElement.style.top = 0; outlineElement.style.left = 0;
            $(outlineElement).addClass('outlineElement');
            top = 0; left = 0;
            $("#outline_layers").append(outlineElement);
            $("#image_layers").append(element);
            elementIndexIndrawingElements = window.outlineElements.length;
        }
        if (type == allComponentTypes.text) {
            $(outlineElement).css({ width: width + 'px', paddint: 1 + 'px', position: 'absolute', zIndex: 500 });
            $(element).css({ width: width + 'px', paddint: 1 + 'px', position: 'absolute' });
            $(element).html(arg1);
            outlineElement.style.top = 0; outlineElement.style.left = 0;
            $(outlineElement).addClass('outlineElement');
            top = 0; left = 0;
            $("#outline_layers").append(outlineElement);
            $("#text_layers").append(element);
            elementIndexIndrawingElements = window.outlineElements.length;
            $(outlineElement).css({ height: element.getBoundingClientRect().height + 'px' });
         }
        if (type == allComponentTypes.image) {
            element = document.createElement('div');
            var imgElement = document.createElement('div');
            var overElement = document.createElement('div');
            outlineElement = document.createElement('div');
            $(outlineElement).css({ width: width + 'px', height: height + 'px', position: 'absolute', zIndex: 200 });
            $(element).css({ width: width + 'px', height: height + 'px', position: 'absolute' });
            outlineElement.style.top = 0; outlineElement.style.left = 0;
            $(outlineElement).addClass('outlineElement');
            top = 0; left = 0;
            $(imgElement).css({ width: '100%', height: '100%', backgroundImage: 'url(' + arg1 + ')', backgroundSize: '100% 100%' ,position:'absolute'});
            $(overElement).css({
                width: '100%', height: '100%', position: 'absolute'
            });
            $(element).append(imgElement);
            $(element).append(overElement);
            $(overElement).css({ borderStyle: 'solid' });
            $("#outline_layers").append(outlineElement);
            $("#image_layers").append(element);
            elementIndexIndrawingElements = window.outlineElements.length;
        }

        window.outlineElements.push(outlineElement);
        createElementsForOutline();
        addEventListeners();

        window.drawingComponents.push(functionalElement);

        var elementRect = element.getBoundingClientRect();
        $(element).css({ left: (canvasRect.width - elementRect.width) / 2 + 'px' });
        $(element).css({ top:  (canvasRect.height - elementRect.height) / 2 + 'px' });
        $(outlineElement).css({ left:  (canvasRect.width - elementRect.width) / 2 + 'px' });
        $(outlineElement).css({ top: (canvasRect.height - elementRect.height) / 2 + 'px' });
        left = (canvasRect.width - elementRect.width) / 2;
        top = (canvasRect.height - elementRect.height) / 2;


        functionalElement.saveAttributesToHistory();
    }

    function createElementsForOutline() {
        if (type != allComponentTypes.text) {
            for (var i = 0; i < 8; i++) {
                var dotelement = document.createElement('div');
                $(dotelement).addClass('dotelement');
                $(dotelement).css({ display: 'none', zIndex: '2001', background: 'white' });
                $(outlineElement).append(dotelement);
                circleDotElements.push(dotelement);
            }
            $(circleDotElements[0]).css({ top: '-4px', left: '-4px', cursor: 'nwse-resize' });
            $(circleDotElements[1]).css({ top: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' });
            $(circleDotElements[2]).css({ top: '-4px', right: '-4px', cursor: 'nesw-resize' });
            $(circleDotElements[3]).css({ top: 'calc(50% - 4px)', right: '-4px', cursor: 'ew-resize' });
            $(circleDotElements[4]).css({ bottom: '-4px', right: '-4px', cursor: 'nwse-resize' });
            $(circleDotElements[5]).css({ bottom: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' });
            $(circleDotElements[6]).css({ bottom: '-4px', left: '-4px', cursor: 'nesw-resize' });
            $(circleDotElements[7]).css({ top: 'calc(50% - 4px)', left: '-4px', cursor: 'ew-resize' });
        }
        if (type == allComponentTypes.text) {
            for (var i = 0; i < 2; i++) {
                var dotelement = document.createElement('div');
                $(dotelement).addClass('squareElement');
                $(dotelement).css({ display: 'none', zIndex: '2001', background: 'white' });
                $(outlineElement).append(dotelement);
                circleDotElements.push(dotelement);
            }
            $(circleDotElements[0]).css({ top: 'calc(50% - 4px)', left: '-8px', cursor: 'ew-resize' });
            $(circleDotElements[1]).css({ top: 'calc(50% - 4px)', right: '-8px', cursor: 'ew-resize' });
        }
        
    }
    function elementIndex() {
        return elementIndexIndrawingElements;
    }
    function unselected() {
        hideImageToolbars();
        isSelected = false;
        for (var i = 0; i < 8; i++) {
            $(circleDotElements[i]).css({ display: 'none' });
        }
        $(outlineElement).css({ border: 'none', cursor: 'pointer', zIndex: 200 });
        if (type == allComponentTypes.text) {
            $(".ui-draggable").hide();
        }
    }

    function disableAllchilds(parent) {
        $(parent).addClass('disabled');
//        var parent = document.getElementById('ds');
        var children = parent.children;
        if (children.length <= 0) {
            
            return;
        }
        for (var i = 0; i < children.length; i++) {
            disableAllchilds(children[i]);
        }
    }
    function enableAllchilds(parent) {
        $(parent).removeClass('disabled');
        var children = parent.children;
        if (children.length <= 0) {
            
            return;
        }
        for (var i = 0; i < children.length; i++) {
            enableAllchilds(children[i]);
        }
    }
    function selected() {
        isSelected = true;
        for (var i = 0; i < 8; i++) {
            $(circleDotElements[i]).css({ display: 'block' });
        }
        if (type == allComponentTypes.image)
            $(outlineElement).css({ cursor: 'move', border: '1px solid red', zIndex: 2000 });
        if (type == allComponentTypes.text)
            $(outlineElement).css({ cursor: 'move', border: '1px solid black', zIndex: 2000 });
        if (type == allComponentTypes.rect || type == allComponentTypes.circle)
            $(outlineElement).css({ cursor: 'move', border: '1px solid black', zIndex: 2000 });
        window.selectedElementIndex = elementIndexIndrawingElements;

        if (type == allComponentTypes.text) {
            $(".ui-draggable").show();
            if (!$(".ui-draggable").has('open')) {
                $(".ui-draggable").addClass('open');
                $(".ui-draggable").removeClass('close');

                $("#inline_textarea").val(element.innerHTML);
                $(".ui-draggable").css(
                    {
                        left: element.getBoundingClientRect().left - 16 - $(".ui-draggable").width() - document.getElementById('canvas').getBoundingClientRect().left + 'px',
                        top: element.getBoundingClientRect().top - $(".ui-draggable").height() + ($(element).height() - $(".ui-draggable").height()) / 2 + 'px'

                    }
                )
            }
            enableAllchilds(document.getElementById('text_tools_section'));
            if (element.style.textAlign.length <= 0) {
                element.style.textAlign = 'left';
            }

            if (element.style.fontStyle == 'italic') {
                $("#btn_text_italic").addClass('on');
            } else {
                $("#btn_text_italic").removeClass('on');
            }


            if (element.style.fontWeight == 'bold') {
                $("#btn_text_bold").addClass('on');
            } else {
                $("#btn_text_bold").removeClass('on');
            }

            switch (element.style.textAlign)
            {
                case 'left':
                    $('#btn_text_gravity_west').addClass('on');
                    $('#btn_text_gravity_center').removeClass('on');
                    $('#btn_text_gravity_east').removeClass('on');
                    break;
                case 'center':
                    $('#btn_text_gravity_center').addClass('on');
                    $('#btn_text_gravity_west').removeClass('on');
                    $('#btn_text_gravity_east').removeClass('on');
                    break;
                case 'right':
                    $('#btn_text_gravity_east').addClass('on');
                    $('#btn_text_gravity_center').removeClass('on');
                    $('#btn_text_gravity_west').removeClass('on');
                    break;
            }
            var tvalue;
            if ($(".ui-draggable").hasClass('open')) {
                tvalue = element.getBoundingClientRect().top - $(".ui-draggable").height() + ($(element).height() - $(".ui-draggable").height()) / 2
            } else {
                tvalue = element.getBoundingClientRect().top - $(".ui-draggable").height() - 45 + ($(element).height() - $(".ui-draggable").height()) / 2
            }
            $(".ui-draggable").css(
                {
                    left: element.getBoundingClientRect().left - 16 - $(".ui-draggable").width() - document.getElementById('canvas').getBoundingClientRect().left + 'px',
                    top: tvalue + 'px'
                }
            )
        } else {
            $(".ui-draggable").hide();
            disableAllchilds(document.getElementById('text_tools_section'));
        }
    }
    function widthOrHeightChanged() {
        if (type == allComponentTypes.image || type == allComponentTypes.rect || type == allComponentTypes.circle) {
            $(outlineElement).css({ width: width >= 5 ? width : 5 + 'px', height: height >= 5 ? height : 5 + 'px', top: top + 'px', left: left + 'px' });
            $(element).css({ width: width >= 5 ? width : 5 + 'px', height: height >= 5 ? height : 5 + 'px', top: top + 'px', left: left + 'px' });
        }
       
        if (type == allComponentTypes.text) {

            $(element).css({ width: width + 'px', left: left + 'px' });
            $(outlineElement).css({ width: width + 'px' });
            $(outlineElement).css({ height: element.getBoundingClientRect().height + 'px', left: left + 'px' });
            var tvalue;
            if ($(".ui-draggable").hasClass('open')) {
                tvalue = element.getBoundingClientRect().top - $(".ui-draggable").height() + ($(element).height() - $(".ui-draggable").height()) / 2
            } else {
                tvalue = element.getBoundingClientRect().top - $(".ui-draggable").height() - 45 + ($(element).height() - $(".ui-draggable").height()) / 2
            }
            $(".ui-draggable").css(
                {
                    left: element.getBoundingClientRect().left - 16 - $(".ui-draggable").width() - document.getElementById('canvas').getBoundingClientRect().left + 'px',
                    top: tvalue + 'px'

                }
            )
        }
    }
    function moveElement(offsetX, offsetY) {
        if (type == allComponentTypes.text) {
            $(".ui-draggable").hide();
        }

        $(outlineElement).css({ cursor: 'move' });
        function stringTOparseFloat(forparsedata) {

            var temp = forparsedata.slice(0, forparsedata.length - 2);
            return parseFloat(temp);
        }
        
        outlineElement.style.top = top + offsetY +"px";
        outlineElement.style.left = left + offsetX + "px";

        element.style.top = top + offsetY + "px";
        element.style.left = left + offsetX + "px";

        
    }
    (function () {
        
        paddingLeft = 0;
        paddingRight = 0;
        paddingTop = 0;
        paddingBottm = 0;
        borderWidth = 0;
        switch (type) {
            case allComponentTypes.image:
                width = 278;
                height = 186;
                break;
            case allComponentTypes.text:
                width = 200;
                break;
            case allComponentTypes.rect:
                width = 124;
                height = 124;
                break;
            case allComponentTypes.circle:
                width = 124;
                height = 124;
                break;
            case allComponentTypes.hline:
                width = 122;
                break;
            case allComponentTypes.vline:
                height = 122;
        }
        
        createElement();

        var startPosX = -1, startPosY = -1, endPosX = -1, endPosY = -1;
        var movingStart = false;

        $(outlineElement).on('mouseover', function () {
            if (!isSelected) {
                $(outlineElement).css({ border: '2px dotted red' });
            }    
        });
        $(outlineElement).on('mouseout', function () {
            if (!isSelected)
                $(outlineElement).css({ border: 'none' });
        });

        $(window).on('mousemove', function (event) {
            if (!isSelected || startPosX == -1)
                return;
            if (dotElementClicked) {
                startPosX = -1, startPosY = -1;
                return;
            }
            
            endPosX = event.pageX;
            endPosY = event.pageY;
            moveElement(endPosX - startPosX, endPosY - startPosY);
            if (!movingStart) {
                var colorstr = document.getElementById('canvas').style.backgroundColor;
                var colorsOnly = colorstr.substring(colorstr.indexOf('(') + 1, colorstr.lastIndexOf(')')).split(/,\s*/);
                
                $("#mask_layers .issueShadow5").animate({
                          borderColor: jQuery.Color('rgb(255,255,255,0.3)'),
                    //opacity: 0.5,
                }, 300, function () {
                    $("#mask_layers img").css({ display: 'block' });
                    $("#mask_layers .issueShadow4").css({ border: '1px dashed red' });
                });
                movingStart = true;
            }
                
        });
        $(window).on('mouseup', function (event) {
        if (movingStart) {
            movingStart = false;
                                $("#mask_layers .issueShadow4").css({ border: '1px solid black' });
                    $("#mask_layers img").css({ display: 'none' });
            $("#mask_layers .issueShadow5").animate({
               // opacity: 1,
                borderColor: jQuery.Color('#eeeeee)'),
            }, 500, function () {
                if (type == allComponentTypes.text) {
                    $("#mask_layers .issueShadow4").css({ border: '1px solid black' });
                    $("#mask_layers img").css({ display: 'none' });
                    $(".ui-draggable").removeClass('open');

                    $(".ui-draggable").show();
                    $(".ui-draggable").addClass('close');

                    $(".ui-draggable").css(
                        {
                            left: element.getBoundingClientRect().left - 16 - $(".ui-draggable").width() - document.getElementById('canvas').getBoundingClientRect().left + 'px',
                            top: element.getBoundingClientRect().top - $(".ui-draggable").height() - 45 + ($(element).height() - $(".ui-draggable").height()) / 2 + 'px'

                        }
                    )
                }
                
             });
         }
            if (startPosX == -1)
                return;
            if (dotElementClicked) {
                startPosX = -1, startPosY = -1;
                return;
            }
            if (!isSelected)
                $(outlineElement).css({ border: 'none' });
            else {
                top += (event.pageY - startPosY);
                left += (event.pageX - startPosX);
                startPosX = -1, startPosY = -1, endPosX = -1, endPosY = -1;
                $("#mask_layers img").css({ display: 'none' });
                showImageToolbars();
            }
        });

        $(outlineElement).on('mousedown', function (event) {
            hideImageToolbars();
            for (var i = 0; i < window.outlineElements.length; i++) {
                if (window.outlineElements[i] != outlineElement) {
                    $(window.outlineElements[i]).trigger('unselected');   
                }
            }
            startPosX = event.pageX;
            startPosY = event.pageY;
            selected();
        });



    }).call(this);

    function showImageToolbars() {
        
        var opacityValue = 100;
        var brColor;
        var bgColor;
        if (type == allComponentTypes.image) {
            var toolbar = $('#image_toolbar');
            if ($(element).find('div')[0].style.opacity.length != 0) {
                opacityValue = $(element).find('div')[0].style.opacity * 100;
            }

            if ($(element).find('div')[1].style.borderColor.length != 0) {
                brColor = $(element).find('div')[1].style.borderColor;
            } else {
                brColor = 'rgb(0,0,0)';
            }
            $(toolbar.find('.selected-color')).trigger('initColorSet', brColor);
            $(toolbar.find('.selected-color')).attr('value', brColor);

            $('#btn_image_opacity').trigger('initopacity', opacityValue);
            toolbar.css({ left: element.getBoundingClientRect().left + (width - 240) / 2 - document.getElementById('canvas').getBoundingClientRect().left + 'px', top: element.getBoundingClientRect().top - 132 + 'px', display: 'block' });
        }

        if (type == allComponentTypes.rect || type == allComponentTypes.circle) {
            var toolbar = $('#shape_toolbar');
            if (element.style.opacity.length != 0) {
                opacityValue = element.style.opacity * 100;
            }

            if (element.style.borderColor.length != 0) {
                brColor = element.style.borderColor;
            } else {
                brColor = 'rgb(0,0,0)';
            }
            if (element.style.backgroundColor.length != 0) {
                bgColor = element.style.backgroundColor;
            } else {
                bgColor = 'rgb(0,0,0)';
            }

            $(toolbar.find("#btn_shape_border_color").find('.selected-color')).trigger('initColorSet', brColor);
            $(toolbar.find("#btn_shape_border_color").find('.selected-color')).attr('value', brColor);
            $(toolbar.find("#btn_shape_fill_color").find('.selected-color')).trigger('initColorSet', bgColor);
            $(toolbar.find("#btn_shape_fill_color").find('.selected-color')).attr('value', bgColor);

            $('#btn_shape_opacity').trigger('initopacity', opacityValue);

            toolbar.css({ left: element.getBoundingClientRect().left + (width - 240) / 2 - document.getElementById('canvas').getBoundingClientRect().left + 'px', top: element.getBoundingClientRect().top - 132 + 'px', display: 'block' });
        }

    }
    function hideImageToolbars() {
        if (type == allComponentTypes.image) {
            var toolbar = $('#image_toolbar');
            toolbar.css({ display: 'none' });
            $('#text_tools_section').addClass('disabled');
        }
        if (type == allComponentTypes.rect || type == allComponentTypes.circle) {
            var toolbar = $('#shape_toolbar');
            toolbar.css({ display: 'none' });
            $('#text_tools_section').addClass('disabled');
        }
    }
}
