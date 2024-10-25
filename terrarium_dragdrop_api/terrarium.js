// 가장 높은 zindex
let highestZIndex = 1;

// 드래그 앤 드롭 API를 처리하는 함수
function addDragAndDropListeners() {
    const plants = document.querySelectorAll('.plant');
    const dropzone = document.querySelector('#terrarium');

    plants.forEach(plant => {
        // 드래그 시작
        plant.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });
    });

    // 드롭존에서 드래그 오버 허용
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault(); // 기본 동작을 막아서 드래그 오버 허용
    });

    // 드롭 시 처리
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        const plantId = e.dataTransfer.getData('text/plain');
        const plant = document.getElementById(plantId);
        const dropzoneRect = dropzone.getBoundingClientRect();
        const offsetX = e.clientX - dropzoneRect.left;
        const offsetY = e.clientY - dropzoneRect.top;

        // 드롭된 위치로 이미지 이동
        plant.style.position = 'absolute';
        plant.style.left = `${offsetX - plant.offsetWidth / 2}px`;
        plant.style.top = `${offsetY - plant.offsetHeight / 2}px`;

        dropzone.appendChild(plant); // 드롭존에 추가
    });
}

// DOM 로드 후 드래그 앤 드롭 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
    addDragAndDropListeners();
});
