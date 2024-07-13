import { message, Spin } from 'antd';
import { Store } from '../src/redux/store/store';
import { _authenticateUser } from './redux/actions/authAction';

export const errorRequestHandel = ({ error }) => {
  if (error?.response?.status === 422) {
    const err = error.response.data.errors;
    message.error(err[Object.keys(err)[0]]);
  } else if (error?.response?.status === 400) {
    message.error(error?.response?.data?.message ?? error?.response?.data?.error);
  } else if (error?.response?.status === 401) {
    localStorage.removeItem('user');
    Store.dispatch(_authenticateUser(false));
    message.error(error?.response?.data?.message);
    // window.location.href = '/';
  } else if (error?.response?.status === undefined) {
    message.error('Server down temporarily');
  } else {
    message.error(error?.response?.data?.message ?? error?.response?.data?.error);
  }
  return null;
};

export const appendFormData = (fileTitle, file, data = {}) => {
  var formData = new FormData();
  if (file !== null) {
    formData.append(fileTitle, file);
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return formData;
  }
};

export const getImageDimensions = (file) => {
  var _URL = window.URL || window.webkitURL;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({
        width: img.width,
        height: img.height,
      });
    img.onerror = (error) => reject(error);
    img.src = _URL.createObjectURL(file);
  });
};

export const isValidEmailAddress = (email) => {
  let pattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  var p = password,
    errors = [];
  if (p.length < 8) {
    errors.push('Password must be 8 charactor long');
  }
  if (p.search(/[a-z]/i) < 0) {
    errors.push('Your password must contain one letter');
  }
  if (p.search(/[0-9]/) < 0) {
    errors.push('Your password must contain one digit');
  }
  return errors;
};

export function findPlanValuesWithType(arr, type) {
  // Iterate over the input array
  for (let i = 0; i < arr.length; i++) {
    // Check if the current item's type is "free"
    if (arr[i].slug === type) {
      // If it is, return the value of the current item
      return arr[i];
    }
  }

  // If no element of type "free" is found, return null or undefined
  return null; // or undefined
}
