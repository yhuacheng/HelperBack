import {
	get,
	post
} from './http'

export const login = (params) => post('/api/BackLogin/UserLogin', params) //登录

export const menuOfUser = (params) => get('/api/BackUser/GetBackUserNavigationBar', params) //菜单目录树(用户权限目录)

export const menuList = (params) => get('/api/BackNavigationBar/GetNavigationBarList', params) //菜单目录树(全部目录)

export const userList = (params) => get('/api/BackUser/GetBackUserList', params) //用户列表
export const userAdd = (params) => post('/api/BackUser/AddBackUser', params) //用户新增
export const userEdit = (params) => post('/api/BackUser/ChangeBackUserState', params) //用户修改
export const userEditPassword = (params) => post('/api/BackUser/ResetPassword', params) //用户密码修改
export const userBindRole = (params) => post('/api/BackUser/AddBackUserByRole', params) //用户绑定角色
export const userCheckedRole = (params) => get('/api/BackUser/GetBackUserIdByRoleId', params) //查看已勾选选角色

export const roleList = (params) => get('/api/BackRole/GetRole', params) //角色列表
export const roleAdd = (params) => post('/api/BackRole/AddRole', params) //角色新增
export const roleEdit = (params) => post('/api/BackRole/ChangeRoleName', params) //角色修改
export const roleBindMenu = (params) => post('/api/BackUser/AddRoleNavigationBar', params) //角色绑定菜单
export const roleCheckedMenu = (params) => get('/api/BackRole/GetRoleIdByNavigationBarId', params) //查看角色已勾选菜单

export const noticeList = (params) => get('/api/BackNoctice/GetNotice', params) //公告列表
export const noticeAdd = (params) => post('/api/BackNoctice/AddBackNoctice', params) //公告新增
export const noticeEdit = (params) => post('/api/BackNoctice/ChangerNotice', params) //公告修改

export const countryList = (params) => get('/api/BackCountry/GetCountry', params) //国家列表
export const countryAdd = (params) => post('/api/BackCountry/AddCountry', params) //国家新增
export const countryEdit = (params) => post('/api/BackCountry/ChangeCountry', params) //国家修改

export const modularList = (params) => get('/api/BackNavBySubmeun/GetSubmenu', params) //模块信息列表
export const modularAdd = (params) => post('/api/BackNavBySubmeun/AddSubmenu', params) //模块信息新增
export const modularEdit = (params) => post('/api/BackNavBySubmeun/ChangeSubmenu', params) //模块信息修改

export const customerList = (params) => get('/api/BackAroundUser/GetAroundUser', params) //客户列表
export const customerState = (params) => post('/api/BackAroundUser/ChangeAroundUserState', params) //客户修改状态
export const customerMod = (params) => post('/api/BackAroundUser/ChangeAccountbalance', params) //客户充值扣款
export const customerBalance = (params) => get('/api/BackAroundUser/GetAroundUserByFinanceLog', params) //客户收支明细

export const takeMoneyList = (params) => get('/api/BackDrawMoney/GetUserByWithdrawalList', params) //提现列表
export const takeMoneyState = (params) => post('/api/BackDrawMoney/ChangeDrawMoenyState', params) //提现修改状态

export const delBadList = (params) => get('/api/BackBadEvaluate/GetUserByBackBadEvaluate', params) //删差评列表
export const delBadState = (params) => post('/api/BackBadEvaluate/ChangeUserByBackBadState', params) //删差评修改状态或价格

export const noBadList = (params) => get('/api/BackPagNoBadEvaluate/GetUserPagNoBadEvaluate', params) //首页无差评列表
export const noBadState = (params) => post('/api/BackPagNoBadEvaluate/ChangeUserPagNoBadEvaluateStateOrMoney', params) //首页无差评修改状态或价格

export const keyToIndexList = (params) => get('/api/BackKeyWordUpPag/GetUserKeyWordUpPag', params) //关键词上首页
export const keyToIndexState = (params) => post('/api/BackKeyWordUpPag/ChangeUserKeyWordUpPagStateOrMoney', params) //关键词上首页修改状态或价格

export const keyReportList = (params) => get('/api/BackAsinKeyWord/GetUserByAsinKeyWord', params) //ASIN关键词报告
export const keyReportState = (params) => post('/api/BackAsinKeyWord/ChangeUserByAsinKeyWordStateOrMoney', params) //ASIN关键词报告修改状态或价格
export const keyReportImg = (params) => post('/api/BackAsinKeyWord/AsinKeyWordUpPagImages', params) //ASIN关键词报告上传图片路径

export const shopCheckList = (params) => get('/api/BackShopReport/GetUserByShopReport', params) //店铺体检报告
export const shopCheckState = (params) => post('/api/BackShopReport/ChangeUserByShopReportStateOrMoney', params) //店铺体检报告修改状态或价格
export const shopCheckImg = (params) => post('/api/BackShopReport/ShopReportImages', params) //店铺体检报告上传图片路径

export const shopCPCList = (params) => get('/api/BackShopCpcReport/GetUserByShopCpcReport', params) //店铺CPC报告
export const shopCPCState = (params) => post('/api/BackShopCpcReport/ChangeUserByShopCpcReportStateOrMoney', params) //店铺CPC报告修改状态或价格
export const shopCPCImg = (params) => post('/api/BackShopCpcReport/ShopCpcReportImages', params) //店铺CPC报告上传图片路径

export const dieSearchList = (params) => get('/api/BackBugQuery/GetUserByBugQuery', params) //死因查询
export const dieSearchState = (params) => post('/api/BackBugQuery/ChangeUserByBugQueryStateOrMoney', params) //死因查询修改状态或价格

export const linkSearchList = (params) => get('/api/BackLinkMailboxQuery/GetUserByLinkMailboxQuery', params) //链接查邮箱
export const linkSearchState = (params) => post('/api/BackLinkMailboxQuery/ChangeUserByLinkMailboxQueryStateOrMoney',
	params) //链接查邮箱修改状态或价格

export const orderSearchList = (params) => get('/api/BackOrderMailboxQuery/GetUserByOrderMailboxQuery', params) //订单查邮箱
export const orderSearchState = (params) => post('/api/BackOrderMailboxQuery/ChangeUserByOrderMailboxQueryStateOrMoney',
	params) //订单查邮箱修改状态或价格

export const addBuyList = (params) => get('/api/BackAddShopCart/GetBackAddShopCart', params) //加购
export const addBuyState = (params) => post('/api/BackAddShopCart/ChangeUserByAddShopCartStateOrMoney', params) //加购修改状态或价格
export const addBuyDone = (params) => post('/api/BackAddShopCart/EndAddShopCartTask', params) //加购处理完毕
export const addBuyImage = (params) => post('/api/BackAddShopCart/AddShopCartFiles', params) //加购上传截图路径

export const wishList = (params) => get('/api/BackWishs/GetBackWishs', params) //心愿单
export const wishState = (params) => post('/api/BackWishs/ChangeUserByWishStateOrMoney', params) //心愿单修改状态或价格
export const wishDone = (params) => post('/api/BackWishs/EndWishsTask', params) //心愿单处理完毕
export const wishImage = (params) => post('/api/BackWishs/WishsUpFiles', params) //心愿单上传截图路径

export const likedHateList = (params) => get('/api/BackDifferent/GetBackDifferent', params) //点赞点踩列表(点赞点踩共用)
export const likedHateState = (params) => post('/api/BackDifferent/ChangeUserByDifferentStateOrMoney', params) //点赞点踩修改状态或价格(点赞点踩共用)
export const likedHateDone = (params) => post('/api/BackDifferent/EndDifferentTask', params) //点赞点踩处理完毕(点赞点踩共用)

export const commentList = (params) => get('/api/BackEvaluate/GetBackEvaluate', params) //评论
export const commentState = (params) => post('/api/BackEvaluate/ChangeUserByEvaluateStateOrMoney', params) //评论修改状态或价格
export const commentDone = (params) => post('/api/BackEvaluate/EndEvaluateTask', params) //评论处理完毕
export const commentImage = (params) => post('/api/BackEvaluate/UpdateImages', params) //评论上传截图路径
