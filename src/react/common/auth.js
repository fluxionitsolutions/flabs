// src/hoc/withAuth.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/');
      } else {
        setIsLoading(false);
      }
    }, [navigate]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
