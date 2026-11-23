import UserController from './UserController'
import RoleController from './RoleController'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers