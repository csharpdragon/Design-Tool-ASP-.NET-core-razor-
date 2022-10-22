$(".modeH").on('click', function () {
    $("#tool_placeholder").html(
        '<div id="canvas" style="width: 949px; height: 371px; top: 5px; left: 3px; background-color: rgb(255, 255, 255);"> <div id="outline_layers" style="z-index: 50;"> <div class="outline2 non-selectable" id="deselector" style="z-index: -1;"></div> <div id="multi_selector" style="display: none; left: 1041px; top: 28px; width: 0px; height: 0px;"></div> </div> <div id="image_layers" style="z-index: 10;"></div> <div id="text_layers" style="z-index: 20;"></div> <div id="overlay_layers" style="z-index: 30;"></div> <div id="mask_layers" style="z-index: 40;"> <div class="bleed-area-mask issueShadow1" style="width: 100%; height: 100%; border: 1px solid gray; z-index: 101; display: none;"></div> <div class="bleed-area-mask issueShadow2" style="width: 908px; height: 330px; margin: 21px; border: 1px dashed red; z-index: 101; display: none;"> </div><img class="bleed-area-mask issueShadow3" src="/images/easy/scissors.png" style="position: absolute; z-index: 110; top: 6px; left: 20%; display: none;"> <div class="no-bleed-area-mask canvas-shadow issueShadow4" style="width: 908px; height: 330px; border: 1px solid gray; margin: 21px; z-index: 101;"></div> <div class="no-bleed-area-mask issueShadow5" style="width: 100%; height: 100%; border-color: rgb(238, 238, 238); border-style: solid; border-width: 21px; z-index: 100;"> </div> <div class="safe-zone-mask dashed" style="width: 866px; height: 289px; left: 41px; top: 41px; display: none;"></div> <div class="safe-zone-mask solid" style="width: 866px; height: 289px; left: 41px; top: 41px; display: none;"></div> </div> <!-- <div id="droppable_layers" style="z-index: 60; display: none;"></div> --> <div id="loading" style="z-index: 80; background-color: rgb(238, 238, 238); display: none;"></div> </div> '
    );
});
$(".modeV").on('click', function () {
    $("#tool_placeholder").html(
        '<div id="canvas" style="width: 331px; height: 845px; top: 5px; left: 312px; background-color: rgb(255, 255, 255);"><div id="outline_layers" style="z-index: 50;"><div class="outline2 non-selectable" id="deselector" style="z-index: -1;"></div><div id="multi_selector" style="display: none;"></div></div><div id="image_layers" style="z-index: 10;"></div><div id="text_layers" style="z-index: 20;"></div><div id="overlay_layers" style="z-index: 30;"></div><div id="mask_layers" style="z-index: 40;"><div class="bleed-area-mask issueShadow1" style="width: 100%; height: 100%; border: 1px solid gray; z-index: 101; display: none;"></div><div class="bleed-area-mask issueShadow2" style="width: 294px; height: 809px; margin: 21px; border: 1px dashed red; z-index: 101; display: none;"></div><img class="bleed-area-mask issueShadow3" src="/images/easy/scissors.png" style="position: absolute; z-index: 110; top: 6px; left: 20%; display: none;"><div class="no-bleed-area-mask canvas-shadow issueShadow4" style="width: 294px; height: 809px; border: 1px solid gray; margin: 21px; z-index: 101;"></div><div class="no-bleed-area-mask issueShadow5" style="width: 100%; height: 100%; border-color: rgb(238, 238, 238); border-style: solid; border-width: 21px; z-index: 100;"><div class="safe-zone-mask dashed" style="width: 257px; height: 772px; left: 37px; top: 37px; display: none;"></div><div class="safe-zone-mask solid" style="width: 257px; height: 772px; left: 37px; top: 37px; display: none;"></div></div><div id="loading" style="z-index: 80; background-color: rgb(238, 238, 238); display: none;"></div></div>'
    );
});
window.mode = 0;
window.viewGrid = false;
///for mode
///for mode
(function () {
    $("#vertical_orientation").parent().on('click', function () {
        window.mode = 1;
        $("#firstPopup img").attr('src', '/images/orientation-vertical.svg');
    });
    $("#horizontal_orientation").parent().on('click', function () {
        window.mode = 0;
        $("#firstPopup img").attr('src', '/images/orientation-horizontal.svg');
    });

    $("#btn_view_zoom_in").on('click', function () {
        if (window.scale < 2) {
            window.scale += 0.1;
        }
        else return;
        window.scale = Math.round(window.scale * 10) * 1.0 / 10;
        $("#canvas").css({ transform: 'scale(' + window.scale + ')', transformOrigin: '0 0' });
        if (window.selectedElementIndex != -1)
            window.drawingComponents[window.selectedElementIndex].showImageToolbars();
        showGridLines();
    });
    $("#btn_view_zoom_out").on('click', function () {
        if (window.scale > 0.5)
            window.scale -= 0.1;
        else return;
        window.scale = Math.round(window.scale * 10) * 1.0 / 10;

        $("#canvas").css({ transform: 'scale(' + window.scale + ')', transformOrigin: '0 0' });
        if (window.selectedElementIndex != -1)
            window.drawingComponents[window.selectedElementIndex].showImageToolbars();
        showGridLines();
    });

    $("#ori_action").on('click', function () {
        $("#firstPopup").hide();
        if (window.side == 0) {
        } else {
        }
    });
    $("#btn_view_grid").on('click', function () {
        if ($("#btn_view_grid").hasClass('on')) {
            $("#btn_view_grid").removeClass('on');
            window.viewGrid = false;
        } else {
            $("#btn_view_grid").addClass('on');
            window.viewGrid = true;
        }
        showGridLines();
    });

}).call(this);


///////grid lines
function showGridLines() {
    $('.divContainer').remove();
    if (window.viewGrid == false)
        return;
    var divContainer = document.createElement('div');
    $(divContainer).css({ width: '100%', height: '100%', position: 'relative' });
    $(divContainer).addClass('divContainer');
    var borderwidth = document.getElementById('mask_layers').getElementsByClassName('issueShadow5')[0].style.borderWidth;
    var canvaswidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();

    var borderwidth = parseInt(borderwidth.slice(0, borderwidth.length - 2));

    var temp = borderwidth + 1 / window.scale;
    var i = 0;
    do {
        if(temp >= canvasHeight)
            break;
        var div = document.createElement('div');
//        div.getBoundingClientRect().width = 1/window.scale+'px';
        $(div).addClass('vline');
        if (i % 4 == 0)
            $(div).css({backgroundColor:'rgb(0,0,0)'})
        $(div).css({ height: 1 / window.scale });

        div.style.top = temp + 'px';
        if (window.mode==0)
            temp += (canvasHeight - 2 * borderwidth) / 8;
        else temp += (canvaswidth - 2 * borderwidth) / 8;
        $(divContainer).append(div);
        i++;
    } while (1);

    temp = borderwidth + 1 / window.scale;
    i = 0;
    do {
        if (temp >= canvaswidth)
            break;
        var div = document.createElement('div');
//        div.getBoundingClientRect().height = 1 / window.scale+ '1px';

        $(div).addClass('hline');
        if (i % 4 == 0)
            $(div).css({ backgroundColor: 'rgb(0,0,0)' })
        $(div).css({ width: 1 / window.scale });
        div.style.left = temp + 'px';
        if (window.mode == 0)
            temp += (canvasHeight - 2 * borderwidth) / 8;
        else temp += (canvaswidth - 2 * borderwidth) / 8;
        $(divContainer).append(div);
        i++;
    } while (1);
    $("#mask_layers").append(divContainer);
}