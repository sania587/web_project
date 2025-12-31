import React from 'react';
import TrainerManagementComponent from '../../components/Admin/TrainerManagementComponent';
import AdminLayout from '../../components/Admin/AdminLayout';

const ManageTrainersPage = () => {
  return (
    <AdminLayout>
      <div className="page-container">
        <div className=" mt-1">
          <TrainerManagementComponent />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageTrainersPage;
