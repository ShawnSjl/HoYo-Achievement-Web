// 用户名: 3-20位，只能包含中文、字母、数字、下划线
export const usernameCharPattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/;

// 密码: 8-50位，需包含字母和数字，可包含部分特殊字符
export const passwordCharPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{}]{8,50}$/;

// 账号名: 3-20位，只能包含中文、字母、数字
export const accountNameCharPattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/;  // 正则表达式：禁止输入包含特殊字符

// 账号UID: 5-20位，只支持数字和英文字母
export const accountUidCharPattern = /^[a-zA-Z0-9]{5,20}$/;
