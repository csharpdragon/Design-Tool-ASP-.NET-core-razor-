window.outlineElements = [];
window.selectedElementIndex = -1;
window.drawingComponents = [];
window.imageElements = [];
function BasicComponent(type, arg1) {

    var historyRecord = [];
    var historyIndex = 0;
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

    var alignPadding = 41;
    /////elements in outlineElements
    var circleDotElements = [];
    var cropElements = [];
    var dotElementClicked = false;
    var islocked = false;
    var zIndex;
    var rotateDegree = 0;
    var outlineLeft, outLineTop;
    var sideValue = 0;
    var isCroping = false;

    ///for image croping
    var backgroundWidth = -1, backgroundHeight = -1, cropX = 0, cropY = 0;

    var movingStart = false;
    functionalElement = {
        startMoving:function() {
            if(!movingStart) {
                var colorstr = document.getElementById('canvas').style.backgroundColor;
                var colorsOnly = colorstr.substring(colorstr.indexOf('(') + 1, colorstr.lastIndexOf(')')).split(/,\s*/);
                movingStart = true;
                $("#mask_layers .issueShadow5").animate({
                    borderColor: jQuery.Color('rgb(255,255,255,0.3)'),
                    //opacity: 0.5,
                }, 300, function () {
                    $("#mask_layers img").css({ display: 'block' });
                    $("#mask_layers .issueShadow4").css({ border: '1px dashed red' });
                });

                hideImageToolbars();
            }
        },
        endMoving: function () {
            if(movingStart) {
                movingStart = false;
                $("#mask_layers .issueShadow4").css({ border: '1px solid black' });
                $("#mask_layers img").css({ display: 'none' });

                $("#mask_layers .issueShadow5").animate({
                    borderColor: jQuery.Color('#eeeeee)'),
                }, 300, function () {
                    $("#mask_layers .issueShadow4").css({ border: '1px solid black' });
                    $("#mask_layers img").css({ display: 'none' });
                    if (type == allComponentTypes.text) {
                        $(".ui-draggable").removeClass('open');
                        $(".ui-draggable").show();
                        $(".ui-draggable").addClass('close');
                        widthOrHeightChanged();
                        showImageToolbars();
                    }

                });
            }
        },
        showImageToolbars: function () {
            showImageToolbars();
        },
        showCropImageToolbars:function() {
            if (type == allComponentTypes.image) {
                for (var i = 0; i < cropElements.length; i++)
                    $(createElement[i]).css({ display: 'block' });
                isCroping = true;
                selected();
            }
        },
        hideCropImageToolbars:function() {
            isCroping = false;
            var toolbar = $("#crop_toolbar");
            toolbar.css({ display: 'none' });
        },
        changingSide: function () {
            hideImageToolbars();
            if (window.side == sideValue && historyIndex >0) {
                    $(element).show();
                    $(outlineElement).show();
            } else {
                $(element).hide();
                $(outlineElement).hide();
            }
        },
        setSide: function (_sideValue) {
            sideValue = _sideValue;
        },
        getSide: function () {
            return sideValue;
        },
        stringTOparseFloat: function(forparsedata) {
            var temp = forparsedata.slice(0, forparsedata.length - 2);
            return parseFloat(temp);
        },
        rotateElementRight: function () {
            rotateDegree += 90;
            rotateDegree %= 360;
            var tempWidth = width;
            width = height;
            height = tempWidth;
            widthOrHeightChanged();
        },
        rotateElementLeft: function () {
            rotateDegree -= 90;
            rotateDegree %= 360;
            var tempWidth = width;
            width = height;
            height = tempWidth;
            widthOrHeightChanged();
        },
        getZIndex: function () {
            return zIndex;
        },
        setZIndex: function (_zIndex) {
            zIndex = _zIndex;
            $(outlineElement).css({ zIndex });
            $(element).css({ zIndex });
        },
        bringToFront: function () {
            if (type == allComponentTypes.text)
                return;
            
            var currentZIndex = this.getZIndex();
            if (currentZIndex >= window.imageElements.length - 1)
                return;
            for (var i = 0; i < window.imageElements.length; i++) {
                var elementItem = window.imageElements[i].functionalElement;
                if (elementItem.getZIndex() == currentZIndex + 1) {
                    elementItem.setZIndex(currentZIndex);
                    this.setZIndex(currentZIndex + 1);
                    break;
                }
            }
        },
        sendToBack: function () {
            if (type == allComponentTypes.text)
                return;
            var currentZIndex = this.getZIndex();
            if (currentZIndex == 0)
                return;
            for (var i = 0; i < window.imageElements.length; i++) {
                var elementItem = window.imageElements[i].functionalElement;
                if (elementItem.getZIndex() == currentZIndex - 1) {
                    elementItem.setZIndex(currentZIndex);
                    this.setZIndex(currentZIndex - 1);
                    break;
                }
            }
            
        },
        bringForward: function () {
            if (type == allComponentTypes.text)
                return;
            var currentZIndex = this.getZIndex();
            if (currentZIndex == window.imageElements.length - 1)
                return;
            for (var i = 0; i < window.imageElements.length; i++) {
                var elementItem = window.imageElements[i].functionalElement;
                if (elementItem.getZIndex() > currentZIndex) {
                    elementItem.setZIndex(elementItem.getZIndex() -1);
                }
            }
            this.setZIndex(window.imageElements.length - 1);
        },
        sendBackward: function () {
            if (type == allComponentTypes.text)
                return;
            var currentZIndex = this.getZIndex();
            if (currentZIndex == 0)
                return;
            for (var i = 0; i < window.imageElements.length; i++) {
                var elementItem = window.imageElements[i].functionalElement;
                if (elementItem.getZIndex() < currentZIndex) {
                    elementItem.setZIndex(elementItem.getZIndex() + 1);
                }
            }
            this.setZIndex(0);
        },
        alignLeft: function () {
            element.style.left = alignPadding + "px";
            outlineElement.style.left = alignPadding + "px";
            left = alignPadding;
        },
        alignCenter: function () {
            left = ($("#canvas").width()  - $(outlineElement).width())/2;
            element.style.left = left + "px";
            outlineElement.style.left = left + "px";
        },
        alignRight: function () {
            left = $("#canvas").width() - alignPadding - $(outlineElement).width();
            element.style.left = left + "px";
            outlineElement.style.left = left + "px";
            
        },
        alignTop: function () {
            element.style.top = alignPadding + "px";
            outlineElement.style.top = alignPadding + "px";
            top = alignPadding;
        },
        alignMiddle: function () {
            top = ($("#canvas").height() - $(outlineElement).height()) / 2;
            element.style.top = top + "px";
            outlineElement.style.top = top + "px";
        },
        alignBottom: function () {
            top = $("#canvas").height() - alignPadding - $(outlineElement).height();
            element.style.top = top + "px";
            outlineElement.style.top = top + "px";
        },
        hide: function () {
            $(element).hide();
            $(outlineElement).hide();
            unselected();
        },
        show: function () {
            $(element).show();
            $(outlineElement).show();

        },
        lockComponent: function () {
            islocked = true;
            $("#btn_edit_lock").addClass('disabled');
            $(outlineElement).trigger('unselected');
            hideImageToolbars();
        },
        unlockComponent: function () {
            islocked = false;
            $("#btn_edit_lock").removeClass('disabled');
        },
        copyAttributeValues: function () {
            var oneRecord = {};
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
            oneRecord.elementborderWidth = element.style.borderWidth;
            oneRecord.arg1 = arg1;
            oneRecord.rotateDegree = rotateDegree;
            return oneRecord;
        },
        moveToPrevHistoryState: function () {
            if (historyIndex <=0)
                return;
            if (historyIndex == 1) {
                functionalElement.hide();
            } else {
                element.style.opacity = historyRecord[historyIndex - 2].opacity;
                element.style.fontStyle = historyRecord[historyIndex - 2].fontStyle;
                element.style.fontWeight = historyRecord[historyIndex - 2].fontWeight;
                element.style.textAlign = historyRecord[historyIndex - 2].textAlign;
                $(element).html(historyRecord[historyIndex - 2].TextContent);
                element.style.color = historyRecord[historyIndex - 2].elementColor;
                element.style.fontSize = historyRecord[historyIndex - 2].elementFontSize;
                element.style.borderColor = historyRecord[historyIndex - 2].RectCircleBorderColor;
                element.style.backgroundColor = historyRecord[historyIndex - 2].RectCircleFillColor;
                element.style.borderStyle = historyRecord[historyIndex - 2].RectCircleBorderStyle;
                width = historyRecord[historyIndex - 2].width; height = historyRecord[historyIndex - 2].height;
                top = historyRecord[historyIndex - 2].top; left = historyRecord[historyIndex - 2].left;
                element.style.borderWidth = historyRecord[historyIndex - 2].elementborderWidth;
                rotateDegree = historyRecord[historyIndex - 2].rotateDegree;
            }

            widthOrHeightChanged();
            historyIndex--;
            islocked = false;
            unselected();
        },
        moveToNextHistoryState: function () {
            if (historyIndex <0)
                return;
            if (historyIndex == 0) {
                functionalElement.show();
            } else {
                element.style.opacity = historyRecord[historyIndex].opacity;
                element.style.fontStyle = historyRecord[historyIndex].fontStyle;
                element.style.fontWeight = historyRecord[historyIndex].fontWeight;
                element.style.textAlign = historyRecord[historyIndex].textAlign;
                $(element).html(historyRecord[historyIndex].TextContent);
                element.style.color = historyRecord[historyIndex].elementColor;
                element.style.fontSize = historyRecord[historyIndex].elementFontSize;
                element.style.borderColor = historyRecord[historyIndex].RectCircleBorderColor;
                element.style.backgroundColor = historyRecord[historyIndex].RectCircleFillColor;
                element.style.borderStyle = historyRecord[historyIndex].RectCircleBorderStyle;
                width = historyRecord[historyIndex].width; height = historyRecord[historyIndex].height;
                top = historyRecord[historyIndex].top; left = historyRecord[historyIndex].left;
                element.style.borderWidth = historyRecord[historyIndex].elementborderWidth;
                rotateDegree = historyRecord[historyIndex].rotateDegree;
            }

            widthOrHeightChanged();
            historyIndex++;
            islocked = false;
            unselected();
        },
        getAttributesFromValues: function (options) {
            element.style.opacity = options.opacity;
            element.style.fontStyle = options.fontStyle;
            element.style.fontWeight = options.fontWeight;
            element.style.textAlign = options.textAlign;
            $(element).html(options.TextContent);
            element.style.color = options.elementColor;
            element.style.fontSize = options.elementFontSize;
            element.style.borderColor = options.RectCircleBorderColor;
            element.style.backgroundColor = options.RectCircleFillColor;
            element.style.borderStyle = options.RectCircleBorderStyle;
            width = options.width; height = options.height;
            top = options.top + 15 * window.scale; left = options.left + 15 * window.scale;
            rotateDegree = options.rotateDegree;
            element.style.borderWidth = options.elementborderWidth;
            widthOrHeightChanged();
            islocked = false;
            historyRecord[historyRecord.length - 1] = options;
            historyRecord[historyRecord.length - 1].changeType = 'create';
            historyRecord[historyRecord.length - 1].top = options.top + 15; historyRecord[historyRecord.length - 1].left = options.left + 15;
        },
        saveAttributesToHistory: function () {
            
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
            oneRecord.elementborderWidth = element.style.borderWidth;
            oneRecord.rotateDegree = rotateDegree;
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
                    oneRecord.left == previousHistory.left && 
                    oneRecord.elementborderWidth == previousHistory.elementborderWidth &&
                    oneRecord.rotateDegree == previousHistory.rotateDegree
                )
                    return;
            }

            historyRecord.splice(historyIndex, historyRecord.length - historyIndex, oneRecord);
            historyIndex++;
            widthOrHeightChanged();
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
            element.style.opacity = _value * 1.0 / 100;
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
        var originBackgroundWidth = width, originBackgroundHeight = height, originCropx = cropX, originCropy = cropY;

        var dstartPosX = -1, dendPosX = -1, dstartPosY = -1, dendPosY = -1;
        function dotEvent(dindex) {
            var originTop = -1, originLeft = -1;

            var dotIndex = dindex;

            var thisDotclicked = false;
            function resizeDotElement() {
                var offsety = (dstartPosY - dendPosY) / window.scale;
                var offsetx = (dstartPosX - dendPosX) / window.scale;
                if (type == allComponentTypes.image || type == allComponentTypes.rect || type == allComponentTypes.circle) {
                    if (dotIndex == 0 || dotIndex == 1 || dotIndex == 2) {
                        height = originHeight + offsety;
                        top = height >= 5 ? originTop - offsety : originTop - (5 - originHeight);
                    }
                    if (dotIndex == 4 || dotIndex == 5 || dotIndex == 6) {
                        height = originHeight - offsety;
                    }
                    if (dotIndex == 2 || dotIndex == 3 || dotIndex == 4) {
                        width = originWidth - offsetx;

                    }
                    if (dotIndex == 6 || dotIndex == 7 || dotIndex == 0) {
                        width = originWidth + offsetx;
                        left = width > 5 ? originLeft - offsetx : originLeft - (5 - originWidth);
                    }

                    if (type == allComponentTypes.image) {
                        if (rotateDegree % 180 == 0) {
                            backgroundWidth = originBackgroundWidth * width * 1.0 / originWidth;
                            backgroundHeight = originBackgroundHeight * height * 1.0 / originHeight;
                            cropX = originCropx * width * 1.0 / originWidth;
                            cropY = originCropy * height * 1.0 / originHeight;
                        } else {
                            backgroundWidth = originBackgroundWidth * height * 1.0 / originHeight;
                            backgroundHeight = originBackgroundHeight * width * 1.0 / originWidth;
                            cropX = originCropx * height * 1.0 / originHeight;
                            cropY = originCropy * width * 1.0 / originWidth ;
                        }
                    }
                }
                if (type == allComponentTypes.text) {
                    if (dotIndex == 0) {
                        width = originWidth + offsetx;
                        left = width > 5 ? originLeft - offsetx : originLeft - (5 - originWidth);
                    } else {
                        width = originWidth - offsetx;
                    }
                }
                widthOrHeightChanged();
            }

            $(circleDotElements[i]).on('mousedown', function (event) {
                dotElementClicked = true;
                thisDotclicked = true;
                originTop = top;
                originLeft = left;
                dstartPosX = event.pageX, dstartPosY = event.pageY;
                originBackgroundWidth = backgroundWidth;
                originBackgroundHeight = backgroundHeight;
                originCropx = cropX, originCropy = cropY;
                if (type == allComponentTypes.image) {
                    if (rotateDegree % 180 == 0) {
                        originWidth = width;
                        originHeight = height;
                    } else {
                        originWidth = width;
                        originHeight = height;
                    }
                }
            });
            $(window).on('mouseup', function (event) {
                if (thisDotclicked == false || dotElementClicked == false)
                    return;
                functionalElement.endMoving();
                dstartPosX = -1; dendPosX = -1; dstartPosY = -1; dendPosY = -1;
                showImageToolbars();
                originTop = -1;
                originLeft = -1;
                originLeft = left;
                if (rotateDegree % 180 != 0 && type == allComponentTypes.image) {
                    originWidth = height >= 5 ? height : 5;;
                    originHeight = width >= 5 ? width : 5;
                   
                } else {
                    originWidth = width >= 5 ? width : 5;;
                    originHeight = height >= 5 ? height : 5;
                }
                originBackgroundWidth = width;
                originBackgroundHeight = height;
                originCropx = cropX;
                originCropy = cropY;

                originTop = top;
                if (dotElementClicked)
                    globalComponentChanged();

                dotElementClicked = false;
                thisDotclicked = false;
                
            });
            $(window).on('mousemove', function (event) {
                if (thisDotclicked == false || dstartPosX == -1 || dotElementClicked == false)
                    return;
                dendPosX = event.pageX, dendPosY = event.pageY;
                functionalElement.startMoving();
                resizeDotElement();
            });
        }
        ////for dot elements
        var coriginWidth = width, coriginHeight = height;
        var cdstartPosX = -1, cdendPosX = -1, cdstartPosY = -1, cdendPosY = -1;
        var coriginCropx = cropX, coriginCropy = cropY;
        function cdotEvent(dindex) {
            var coriginTop = -1, coriginLeft = -1;
            var cdotIndex = dindex;
            var thisDotclicked = false;
            function resizeDotElement() {
                var offsety = (cdstartPosY - cdendPosY) / window.scale;
                var offsetx = (cdstartPosX - cdendPosX) / window.scale;
                if (type == allComponentTypes.image || type == allComponentTypes.rect || type == allComponentTypes.circle) {
                    
                    if (cdotIndex == 0 || cdotIndex == 1 || cdotIndex == 2) {
                        top = height >= 5 ? coriginTop - offsety : coriginTop - (5 - coriginHeight);
                        width = coriginWidth; 
                        height = coriginHeight;
                        if (type == allComponentTypes.image) {
                            if (rotateDegree % 360 == 0)
                                cropY = coriginCropy + offsety, height = coriginHeight + offsety;
                            if (rotateDegree % 360 == 90)
                                cropX = coriginCropx + offsety, height = coriginHeight + offsety, width = coriginWidth;
                            if (rotateDegree % 360 == 180)
                                height = coriginHeight + offsety, width = coriginWidth;
                            if (rotateDegree % 360 == 270)
                                height = coriginWidth + offsety, width = coriginHeight;

                        }
                    }
                    if (cdotIndex == 4 || cdotIndex == 5 || cdotIndex == 6) {
                        
                        if (type == allComponentTypes.image) {
                            if (rotateDegree % 360 == 180)
                                cropY = coriginCropy - offsety, height = coriginHeight - offsety, width = coriginWidth;
                            if (rotateDegree % 360 == 270)
                                cropX = coriginCropx - offsety, height = coriginHeight - offsety, width = coriginWidth;
                            if (rotateDegree % 360 == 0)
                                height = coriginHeight - offsety;
                            if (rotateDegree % 360 == 90)
                                height = coriginHeight - offsety, width = coriginWidth;
                        }
                    }
                    if (cdotIndex == 2 || cdotIndex == 3 || cdotIndex == 4) {
                        
                        if (type == allComponentTypes.image) {
                            if (rotateDegree % 360 == 90)
                                cropY = coriginCropy - offsetx, width = coriginWidth - offsetx, height = coriginHeight;
                            if (rotateDegree % 360 == 180)
                                cropX = coriginCropx - offsetx, width = coriginWidth - offsetx, height = coriginHeight;
                            if (rotateDegree % 360 == 0)
                                width = coriginWidth - offsetx;
                            if (rotateDegree % 360 == 270)
                                width = coriginWidth - offsetx, height = coriginHeight;
                        }
                    }
                    if (cdotIndex == 6 || cdotIndex == 7 || cdotIndex == 0) {
                        left = width > 5 ? coriginLeft - offsetx : coriginLeft - (5 - coriginWidth);
                        if (type == allComponentTypes.image) {
                            if (rotateDegree % 360 == 270)
                                cropY = coriginCropy + offsetx, width = coriginWidth + offsetx, height = coriginHeight;
                            if (rotateDegree % 360 == 0)
                                cropX = coriginCropx + offsetx, width = coriginWidth + offsetx;
                            if (rotateDegree % 360 == 180)
                                width = coriginWidth + offsetx;
                            if (rotateDegree % 360 == 90)
                                width = coriginWidth + offsetx, height = coriginHeight;
                        }
                    }
                }
                widthOrHeightChanged();
            }

            $(cropElements[i]).on('mousedown', function (event) {
                dotElementClicked = true;
                thisDotclicked = true;
                coriginTop = top;
                coriginLeft = left;
                cdstartPosX = event.pageX, cdstartPosY = event.pageY;

                coriginHeight = height;
                coriginWidth =width;

                coriginCropx = cropX;
                coriginCropy = cropY;
            });
            $(window).on('mouseup', function (event) {
                if (thisDotclicked == false || dotElementClicked == false)
                    return;
                functionalElement.endMoving();
                cdstartPosX = -1; cdendPosX = -1; cdstartPosY = -1; cdendPosY = -1;
                functionalElement.showCropImageToolbars();
                

                coriginTop = -1;
                coriginLeft = -1;
//                if (rotateDegree % 180 == 0) {
                    coriginWidth = width >= 5 ? width : 5;;
                    coriginHeight = height >= 5 ? height : 5;
 /*               } else {
                    coriginHeight = width >= 5 ? width : 5;;
                    coriginWidth = height >= 5 ? height : 5;
                }
                */

                coriginTop = top;
                coriginLeft = left;
                if (dotElementClicked)
                    globalComponentChanged();
                /*
                if (rotateDegree % 180 != 0) {
                    var tempwidth = width;
                    width = height; height = tempwidth;
                }*/
                coriginCropx = cropX;
                coriginCropy = cropY;

                dotElementClicked = false;
                thisDotclicked = false;

            });
            $(window).on('mousemove', function (event) {
                if (thisDotclicked == false || cdstartPosX == -1 || dotElementClicked == false)
                    return;
                cdendPosX = event.pageX, cdendPosY = event.pageY;
                functionalElement.startMoving();
                resizeDotElement();
            });
        }
        ////for dot elements
        for (var i = 0; i < circleDotElements.length; i++) {
            dotEvent(i);
            cdotEvent(i);
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
            $(outlineElement).css({ width: width + 'px', height: height + 'px', position: 'absolute', zIndex: window.imageElements.length });
            $(element).css({ width: width + 'px', height: height + 'px', position: 'absolute' });
            outlineElement.style.top = 0; outlineElement.style.left = 0;
            $(outlineElement).addClass('outlineElement');
            top = 0; left = 0;
            $(imgElement).css({ width: '100%', height: '100%', backgroundImage: 'url(' + arg1 + ')', backgroundSize: '100% 100%', position: 'absolute' });
            backgroundWidth = width;
            backgroundHeight = height;
            cropX = 0;
            cropY = 0;
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

        if (type != allComponentTypes.text) {
            var newImageElement = {};
            newImageElement.elementIndex = window.drawingComponents.length,
            zIndex = window.imageElements.length;
            newImageElement.zIndex = window.imageElements.length;
            newImageElement.functionalElement = functionalElement;
            window.imageElements.push(newImageElement);
            $(element).css({ zIndex });
            $(outlineElement).css({ zIndex });
        }

        window.drawingComponents.push(functionalElement);

        

        var elementRect = element.getBoundingClientRect();
        $(element).css({ left: (canvasRect.width - elementRect.width) / 2 + 'px' });
        $(element).css({ top:  (canvasRect.height - elementRect.height) / 2 + 'px' });
        $(outlineElement).css({ left:  (canvasRect.width - elementRect.width) / 2 + 'px' });
        $(outlineElement).css({ top: (canvasRect.height - elementRect.height) / 2 + 'px' });
        left = (canvasRect.width - elementRect.width) / 2;
        top = (canvasRect.height - elementRect.height) / 2;

        globalComponentCreated();

        for (var i = 0; i < window.outlineElements.length; i++) {
            if (window.outlineElements[i] != outlineElement) {
                $(window.outlineElements[i]).trigger('unselected');
            }
        }
        selected();
        widthOrHeightChanged();
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
        if (type == allComponentTypes.image) {
            for (var i = 0; i < 8; i++) {
                var dotelement = document.createElement('div');
                $(dotelement).addClass('cropelement');
                $(dotelement).css({ display:'none', zIndex: '2001', width: '20px', height: '20px', backgroundColor: 'rgba(0,0,0,0)' });
                $(outlineElement).append(dotelement);
                cropElements.push(dotelement);
            }
            for (var i = 0; i < 3; i++)
                $(cropElements[i]).css({ borderTop: '3px solid black', color: 'black' });
            for (var i = 2; i < 5; i++)
                $(cropElements[i]).css({ borderRight: '3px solid black', color: 'black' });
            for (var i = 4; i < 7; i++)
                $(cropElements[i]).css({ borderBottom: '3px solid black', color: 'black' });
            for (var i = 6; i < 9; i++)
                $(cropElements[i%8]).css({ borderLeft: '3px solid black', color: 'black' });
            $(cropElements[0]).css({ top: '-4px', left: '-4px', cursor: 'nwse-resize' });
            $(cropElements[1]).css({ top: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' });
            $(cropElements[2]).css({ top: '-4px', right: '-4px', cursor: 'nesw-resize' });
            $(cropElements[3]).css({ top: 'calc(50% - 4px)', right: '-4px', cursor: 'ew-resize' });
            $(cropElements[4]).css({ bottom: '-4px', right: '-4px', cursor: 'nwse-resize' });
            $(cropElements[5]).css({ bottom: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' });
            $(cropElements[6]).css({ bottom: '-4px', left: '-4px', cursor: 'nesw-resize' });
            $(cropElements[7]).css({ top: 'calc(50% - 4px)', left: '-4px', cursor: 'ew-resize' });
        }
        
    }
    function elementIndex() {
        return elementIndexIndrawingElements;
    }
    function unselected() {
        hideImageToolbars();
        functionalElement.hideCropImageToolbars();
        isCroping = false;
        isSelected = false;
        for (var i = 0; i < 8; i++) {
            $(circleDotElements[i]).css({ display: 'none' });
            $(cropElements[i]).css({ display: 'none' });
        }
        $(outlineElement).css({ border: 'none', cursor: 'pointer', zIndex: zIndex });
        if (type == allComponentTypes.text) {
            $(".ui-draggable").hide();
        }
        $("#btn_advance_layers").addClass('disabled');
        $("#btn_advance_align").addClass('disabled');
        $("#btn_edit_copy").addClass('disabled');
        $("#btn_edit_delete").addClass('disabled');
        $("#btn_edit_lock").addClass('disabled');
        $("#btn_advance_crop").addClass('disabled');
        $("#btn_advance_rotate").addClass('disabled');
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
        if (islocked)
            return;
        isSelected = true;
        if (type != allComponentTypes.image || isCroping == false)
            for (var i = 0; i < 8; i++) {

                $(circleDotElements[i]).css({ display: 'block' });
                $(cropElements[i]).css({ display: 'none' });
            }
        else
            for (var i = 0; i < 8; i++) {
                $(circleDotElements[i]).css({ display: 'none' });
                $(cropElements[i]).css({ display: 'block' });
            }

        if (type == allComponentTypes.image) {
            if (!isCroping)
                $(outlineElement).css({ cursor: 'move', border: '1px solid red', zIndex: 2000 });
            else {
                $(outlineElement).css({ cursor: 'pointer', border: 'none', zIndex: 2000 });
                hideImageToolbars();
            }

        }
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
        } else {
            $(".ui-draggable").hide();
            disableAllchilds(document.getElementById('text_tools_section'));
        }

        if (type == allComponentTypes.image) {
            $("#btn_advance_crop").removeClass('disabled');
            $("#btn_advance_rotate").removeClass('disabled');
        }
        if (type == allComponentTypes.text) {
            $("#btn_advance_crop").addClass('disabled');
            $("#btn_advance_rotate").removeClass('disabled');
        }
        if (type == allComponentTypes.rect || type == allComponentTypes.circle) {
            $("#btn_advance_crop").addClass('disabled');
            $("#btn_advance_rotate").addClass('disabled');
        }
        widthOrHeightChanged();
        $("#btn_advance_align").removeClass('disabled');
        $("#btn_advance_layers").removeClass('disabled');
        $("#btn_edit_copy").removeClass('disabled');
        $("#btn_edit_delete").removeClass('disabled');
        $("#btn_edit_lock").removeClass('disabled');
    }

    function widthOrHeightChanged() {
        if (type == allComponentTypes.image || type == allComponentTypes.rect || type == allComponentTypes.circle) {
            $(element).css({ width: width >= 5 ? width : 5 + 'px', height: height >= 5 ? height : 5 + 'px', top: top + 'px', left: left + 'px' });
        }
        
        if (type == allComponentTypes.text) {

            $(element).css({ width: width + 'px', left: left + 'px',top:top+'px',backgoundColor:'rgba(255,255,255,0)'});
            $(outlineElement).css({ width: width + 'px' });
            $(outlineElement).css({ height: element.getBoundingClientRect().height + 'px', left: left + 'px' });
            var tvalue;
            if ($(".ui-draggable").hasClass('open')) {
                tvalue = element.getBoundingClientRect().top - $(".ui-draggable").height() / 2;
            } else {
                tvalue = element.getBoundingClientRect().top - $(".ui-draggable").height() / 2 + 10;
            }
            if (window.side == 1)
                tvalue += 20;
            $(".ui-draggable").css(
                {
                    left: element.getBoundingClientRect().left - 20 - $(".ui-draggable").width()  + 'px',
                    top: tvalue + 'px'

                }
            )
        }
        $(outlineElement).css({ width: element.getBoundingClientRect().width / window.scale + 'px', height: element.getBoundingClientRect().height / window.scale + 'px', left: left + 'px', top: top + 'px' });

        if (rotateDegree % 180 == 0 || (type != allComponentTypes.text && type != allComponentTypes.image)) {
            $($(element).find("div")[0]).css({ transform: 'rotate(' + rotateDegree + 'deg)', height: height + 'px', left: '0px', width: width + 'px', top:'0px' });
        }
        else {
            if (type == allComponentTypes.image) {
                $($(element).find("div")[0]).css({ transform: 'rotate(' + rotateDegree + 'deg)', height: width + 'px', left: -(height - width) / 2 + 'px', width: height + 'px', top: (height - width) / 2 + 'px' });
            }
        }
        if (type == allComponentTypes.image) {
            $($(element).find("div")[0]).css({ backgroundPosition: cropX + 'px ' + cropY + 'px', backgroundSize: backgroundWidth + 'px ' + backgroundHeight+'px' ,backgroundRepeat:'no-repeat'});
        }
        showImageToolbars();
    }
    function moveElement(offsetX, offsetY) {
        if (type == allComponentTypes.text) {
            $(".ui-draggable").hide();
        }


        $(outlineElement).css({ cursor: 'move' });
        
        
        outlineElement.style.top = top + offsetY +"px";
        outlineElement.style.left = left + offsetX + "px";

        element.style.top = top + offsetY + "px";
        element.style.left = left + offsetX + "px";
    }
    (function () {
        sideValue = window.side;
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

        $(outlineElement).on('mouseover', function () {
            if (!isSelected && !isCroping) {
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
            moveElement((endPosX - startPosX) / window.scale, (endPosY - startPosY) / window.scale);
            functionalElement.startMoving();
                
        });
        $(window).on('mouseup', function (event) {
            functionalElement.endMoving();
            if (startPosX == -1)
                return;
            if (dotElementClicked) {
                startPosX = -1, startPosY = -1;
                return;
            }
            if (!isSelected)
                $(outlineElement).css({ border: 'none' });
            else {
                if (event.pageY - startPosY == 0 && event.pageX - startPosX == 0) {
                    startPosX = -1, startPosY = -1, endPosX = -1, endPosY = -1;
                    $("#mask_layers img").css({ display: 'none' });
                    showImageToolbars();
                    return;
                }
                top += (event.pageY - startPosY) / window.scale;
                left += (event.pageX - startPosX) / window.scale;
                startPosX = -1, startPosY = -1, endPosX = -1, endPosY = -1;
                
                globalComponentChanged();
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
            if (isCroping) {
                return;
            }
            if (!islocked) {
                startPosX = event.pageX;
                startPosY = event.pageY;
                selected();
            }

        });

        $(outlineElement).on('dblclick', function (event) {
            functionalElement.unlockComponent();
            hideImageToolbars();
            for (var i = 0; i < window.outlineElements.length; i++) {
                if (window.outlineElements[i] != outlineElement) {
                    $(window.outlineElements[i]).trigger('unselected');
                }
            }
            selected();
        });
    }).call(this);
    
    function showImageToolbars() {
        if (isCroping) {
            var toolbar = $("#crop_toolbar");
            $("#crop_toolbar").show();
            if (element.getBoundingClientRect().top - document.getElementById('canvas').getBoundingClientRect().top >= 70)
                toolbar.css({ left: element.getBoundingClientRect().left + (width * window.scale - 270) / 2 + 'px', top: element.getBoundingClientRect().top - 105 + window.scrollY+'px', display: 'block' });
            else {
                toolbar.css({ left: element.getBoundingClientRect().left + (width * window.scale - 270) / 2 + 'px', top: element.getBoundingClientRect().top + window.scrollY + element.getBoundingClientRect().height  + 5 + 'px', display: 'block' });
            }
            hideImageToolbars();
            return;
        }
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

            if (element.getBoundingClientRect().top - document.getElementById('canvas').getBoundingClientRect().top + window.scrollX >= 35)
                toolbar.css({ left: element.getBoundingClientRect().left + (width * window.scale - 240) / 2 + 'px', top: element.getBoundingClientRect().top - 50 + window.scrollY + 'px', display: 'block' });
            else {
                toolbar.css({ left: element.getBoundingClientRect().left + (width * window.scale - 240) / 2 + 'px', top: element.getBoundingClientRect().top + window.scrollY + element.getBoundingClientRect().height  + 5 + 'px', display: 'block' });
                
            }
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

            if (element.getBoundingClientRect().top - document.getElementById('canvas').getBoundingClientRect().top - window.scrollX >= 30)
                toolbar.css({ left: element.getBoundingClientRect().left + (width * window.scale - 240) / 2, top: element.getBoundingClientRect().top + window.scrollY - 50 + 'px', display: 'block' });
            else {
                toolbar.css({ left: element.getBoundingClientRect().left + (width * window.scale - 240) / 2 + 'px', top: element.getBoundingClientRect().top + element.getBoundingClientRect().height +5+ 'px', display: 'block' });
            }
            
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
