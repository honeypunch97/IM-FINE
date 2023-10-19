document.addEventListener('DOMContentLoaded', function () {
   // data형식 [{id : string, value:number(int)}]
   let data = [
      { id: 0, value: 75 },
      { id: 1, value: 20 },
      { id: 2, value: 80 },
      { id: 3, value: 100 },
      { id: 4, value: 70 },
   ];

   const graphUI = document.querySelector('.graph-container .graph');
   const graphID = document.querySelector('.graph-container .id');
   const tableBody = document.querySelector('table tbody');
   const editForm = document.querySelector('.edit-section form');
   const addForm = document.querySelector('.add-section form');
   const textArea = document.querySelector('.advanced-edit-section textarea');
   const advancedEditApplyBtn = document.querySelector('.advanced-edit-section .applyBtn');

   /**
    * UI업데이트(그래프, 테이블, 고급편집기)
    * data값으로 UI최신화
    */
   const updateUI = () => {
      graphUI.innerHTML = '';
      graphID.innerHTML = '';
      tableBody.innerHTML = '';

      data.forEach(item => {
         // 그래프 UI
         const graphItem = document.createElement('li');
         graphItem.style.height = `${item.value}%`;
         graphUI.append(graphItem);
         const graphItemID = document.createElement('li');
         graphItemID.textContent = item.id;
         graphID.append(graphItemID);

         // 테이블 UI
         const row = document.createElement('tr');
         const idCell = document.createElement('td');
         idCell.textContent = item.id;
         const valueCell = document.createElement('td');
         const valueInput = document.createElement('input');
         valueInput.type = 'number';
         valueInput.min = 0;
         valueInput.max = 100;
         valueInput.value = item.value;
         const buttonCell = document.createElement('td');
         const deleteButton = document.createElement('button');
         deleteButton.className = 'delBtn';
         deleteButton.textContent = '삭제하기';
         buttonCell.append(deleteButton);
         valueCell.append(valueInput);
         row.append(idCell);
         row.append(valueCell);
         row.append(buttonCell);
         tableBody.append(row);

         // 삭제 버튼에 이벤트 처리 추가
         deleteButton.addEventListener('click', () => {
            data = data.filter(dItem => dItem.id !== item.id);
            updateUI();
         });
      });
      // 값 고급 편집 data 최신화
      textArea.value = JSON.stringify(data, null, 2);
   };

   /**
    * 값 추가
    * ID, VALUE값으로 data에 추가
    */
   const addData = () => {
      const idInput = document.querySelector('#textId');
      const valueInput = document.querySelector('#textValue');

      if (data.find(item => item.id === idInput.value)) {
         // ID값 중복체크
         alert('ID값이 중복됩니다');
      } else {
         data.push({ id: idInput.value, value: Number(valueInput.value) });
      }

      updateUI();
      idInput.value = '';
      valueInput.value = '';
      idInput.focus();
   };

   /**
    * data값이 형식에 맞는지 체크
    * @param {[{id:string, value:Number}]} data
    * @returns {boolean}
    *
    */
   const isJSONFormatValid = data => {
      let idDupArr = [];

      if (!Array.isArray(data)) {
         // 배열 확인
         return false;
      }
      for (const item of data) {
         if (
            // obj인지, id값과 value가 있는지, value가 숫자이고 정수인지
            typeof item !== 'object' ||
            !item.hasOwnProperty('id') ||
            !item.hasOwnProperty('value') ||
            typeof item.value !== 'number' ||
            !Number.isInteger(item.value) ||
            item.value < 0 ||
            item.value > 100
         ) {
            return false;
         } else {
            // id값 중복체크
            if (idDupArr.find(dupItem => dupItem === item.id)) {
               return false;
            } else {
               idDupArr.push(item.id);
            }
         }
      }
      return true;
   };

   /**
    * 값 편집 apply
    */
   const applyEdit = () => {
      const tds = editForm.querySelectorAll('td input');
      let tdsData = [];
      let isAllFill = true; // 빈 값 체크용
      tds.forEach(item => {
         if (item.value) {
            tdsData.push(item.value);
         } else {
            isAllFill = false;
         }
      });
      if (isAllFill) {
         // 값이 모두 있으면 data 최신화
         data = [...data.map((dataItem, idx) => ({ ...dataItem, value: Number(tdsData[idx]) }))];
      } else {
         alert('빈 값이 있습니다');
      }
      updateUI();
   };

   /**
    * 값 고급 편집 apply
    */
   const applyAdvancedEdit = () => {
      try {
         // 에러체크
         if (isJSONFormatValid(JSON.parse(textArea.value))) {
            // 형식 체크
            data = JSON.parse(textArea.value);
         } else {
            alert('데이터 형식이 맞지않습니다');
         }
      } catch {
         alert('데이터 형식이 맞지않습니다');
      }
      updateUI();
   };

   editForm.addEventListener('submit', e => {
      e.preventDefault();
      applyEdit();
   });
   addForm.addEventListener('submit', e => {
      e.preventDefault();
      addData();
   });
   advancedEditApplyBtn.addEventListener('click', () => applyAdvancedEdit());
   updateUI();
});
