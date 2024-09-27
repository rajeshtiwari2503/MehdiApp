import React  from 'react';
import EditDealerProfile from './EditDealerProfile';


const EditProfile = ({ isVisible, RefreshData,onClose, user  }) => {
  
  return (
     <>
     <EditDealerProfile isVisible={isVisible}RefreshData={RefreshData} onClose={onClose} user={user} />
     </>
  );
};

 

export default EditProfile;
