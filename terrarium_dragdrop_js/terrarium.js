onpointerup = null;
onpointermove = null;

// 가장 높은 zindex
let highestZIndex = 1;

function dragElement(terrariumElement) {
    let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    // pointerDrag()가 아닌 이유는 ()는 즉시 실행되는거고 ()없으면 참조하는 의미라서 () 안쓰임
    terrariumElement.onpointerdown = pointerDrag;
    terrariumElement.ondblclick = zIndexUp;

    function zIndexUp() {
        highestZIndex++;  // 가장 높은 zindex 증가
        terrariumElement.style.zIndex = highestZIndex;  // 해당 요소의 zindex를 가장 높게 설정
    }
    function pointerDrag(e) {
        e.preventDefault();
        console.log(e);        
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }
    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        console.log(pos1, pos2, pos3, pos4);
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
    }
    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
    }
}

console.log(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));