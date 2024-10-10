export const spinnerStyles = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  
export const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 70,
  };


// export const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       backgroundColor: '#F3F4F6', // Same as input background color
//       borderColor: '#E5E7EB', // Same as input border color
//       borderRadius: '0.375rem',
//       padding: '0.1rem',
//       fontSize: '0.875rem',
//       minHeight: 'auto',
//       boxShadow: 'none',
//       '&:hover': {
//         borderColor: '#E5E7EB'
//       }
//     }),
//     menu: (provided) => ({
//       ...provided,
//       backgroundColor: '#F3F4F6', // Same as input background color
//       borderRadius: '0.375rem',
//       borderColor: '#E5E7EB'
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected ? '#E5E7EB' : '#F3F4F6',
//       '&:hover': {
//         backgroundColor: '#E5E7EB'
//       }
//     })
//   };