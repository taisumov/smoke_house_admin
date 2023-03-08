import React, { useMemo, useState, useEffect } from "react";
import Mmodal from "./components/UI/modal/Mmodal";
import MButton from "./components/UI/button/MButton";

const OModal = () => {  
  const [modal, setModal] = useState(false);
  return (
    <div className="OModal">
    <MButton onClick={() => setModal(true)}>
      Открыть модальное окно
      </MButton>
    <Mmodal visible={modal} setVisible={setModal}>
      jgjhghjghjg
      <MButton onClick={() => setModal(false)}>
         Закрыть модалку
       </MButton>
      </Mmodal> 
    </div>
  );
}

export default OModal;