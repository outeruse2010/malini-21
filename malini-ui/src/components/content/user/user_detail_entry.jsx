import React from 'react'

const UserDetailEntry = ({selected_user_row, openEditUserModal, toggleEditUserModal}) => {
    const classes = useStyles();

    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    
    return (
        <div>
            
        </div>
    )
}

export default UserDetailEntry;
