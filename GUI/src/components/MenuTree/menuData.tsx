import {
  MdOutlineAdb,
  MdOutlineEqualizer,
  MdOutlineForum,
} from 'react-icons/md';

const env = import.meta.env;

export const menuData = [
  {
    id: 'clients',
    icon: <MdOutlineForum className="menu-item-icon" />,
    url: `/${env.REACT_APP_PROJECT_LAYER}/clients`,
  },
  {
    id: 'users',
    icon: <MdOutlineAdb className="menu-item-icon" />,
    url: `/${env.REACT_APP_PROJECT_LAYER}/users`,
  },
  {
    id: 'clusters',
    icon: <MdOutlineEqualizer className="menu-item-icon" />,
    url: `/${env.REACT_APP_PROJECT_LAYER}/clusters`,
  },
  {
    id: 'audit',
    icon: <MdOutlineForum className="menu-item-icon" />,
    url: `/${env.REACT_APP_PROJECT_LAYER}/audit`,
  },
  {
    id: 'documentation',
    icon: <MdOutlineForum className="menu-item-icon" />,
    url: `/${env.REACT_APP_PROJECT_LAYER}/documentation`,
  },
];
