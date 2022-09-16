<template>
  <div class="xw-layout-header">
    <div class="xw-layout-header--name">
      <img :src="logo" alt="logo">
      <span>{{ systemName }}</span>
    </div>
    <el-dropdown trigger="click" @command="handlerDropDownClick">
      <div class="xw-layout-header--user">
        <i class="el-icon-user user" />
        <span class="name">{{ userInfo.userName }} <span>|</span> {{ userInfo.groupName }}</span>
        <i class="el-icon-caret-bottom caret" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="updatePassword">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 修改密码弹窗 -->
    <el-dialog
      width="400px"
      title="修改密码"
      :append-to-body="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @closed="handleDialogClosed"
    >
      <el-form ref="dialogForm" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPasswd">
          <el-input
            v-model="formData.oldPasswd"
            type="password"
            clearable
            maxlength="50"
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="freshPasswd">
          <el-input
            v-model="formData.freshPasswd"
            type="password"
            clearable
            maxlength="50"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            clearable
            maxlength="50"
            placeholder="请输入确认密码"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogLoading" @click="dialogVisible = false">取消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="handlerConfirmClick">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSessionStorage } from '@/utils/tools';
// eslint-disable-next-line import/no-unresolved
import { logout, updatePassword } from '@/api/authorize';

const logo = require('@/assets/logo.png');

export default {
  name: 'LayoutHeader',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (this.formData.oldPasswd === value) {
        callback(new Error('新密码不能和旧密码相同！'));
        return;
      }

      callback();
    };

    const validateComfirmPwd = (rule, value, callback) => {
      if (this.formData.freshPasswd !== value) {
        callback(new Error('确认密码与新密码不一致！'));
        return;
      }

      callback();
    };

    return {
      userInfo: {},
      logo,
      systemName: '',
      formData: {
        oldPasswd: '',
        freshPasswd: '',
        password: '',
      },
      formRules: {
        oldPasswd: [
          { required: true, message: '请输入旧密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '请输入 6 - 16 位密码', trigger: ['blur', 'change'] },
        ],
        freshPasswd: [
          { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '请输入 6 - 16 位密码', trigger: ['blur', 'change'] },
          { validator: validatePassword, trigger: ['blur', 'change'] },
        ],
        password: [
          { required: true, message: '请输入确认密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '请输入 6 - 16 位密码', trigger: ['blur', 'change'] },
          { validator: validateComfirmPwd, trigger: ['blur', 'change'] },
        ],
      },
      dialogLoading: false,
      dialogVisible: false,
    };
  },
  created() {
    const user = getSessionStorage('user');
    this.userInfo = user || {};
    this.systemName = window.projectConfig.name;
  },
  methods: {
    /**
     * 点击下拉菜单
     */
    handlerDropDownClick(type) {
      if (type === 'logout') {
        this.handlerLogoutClick();
      } else {
        this.dialogVisible = true;
      }
    },

    /**
     * 点击退出登录
     */
    handlerLogoutClick() {
      this.$confirm('您确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        logout().then(({ code, message }) => {
          if (!code) {
            this.$router.push('/login');
            this.$message.success('退出成功！');
            return;
          }

          this.$message.error(message);
        }).catch(() => {});
      });
    },

    /**
     * 弹窗点击确认按钮
     */
    async handlerConfirmClick() {
      const boolean = await this.$refs.dialogForm.validate();
      if (!boolean) return;
      this.dialogLoading = true;

      const params = {
        id: this.userInfo.id,
        oldPasswd: this.formData.oldPasswd,
        freshPasswd: this.formData.freshPasswd,
      };

      updatePassword(params).then(({ code, message }) => {
        if (!code) {
          this.dialogVisible = false;
          this.dialogLoading = false;
          this.$confirm('修改密码成功，请重新登录', {
            confirmButtonText: '确定',
            showCancelButton: false,
          }).then(() => {
            this.$router.push('/login');
          }).catch(() => {});
          return;
        }

        this.$message.warning(message);
      }).catch(() => {
        this.dialogLoading = false;
      });
    },

    /**
     * 弹窗关闭动画结束之后请况 form 表单
     */
    handleDialogClosed() {
      this.formData = this.$options.data().formData;
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate();
        this.$emit('update:visible', false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.xw-layout-header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  flex: 0 0 auto;
  background: $-layout-header-bg-color;

  .xw-layout-header--name {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: $-layout-header-font-color;

    > img {
      display: inline-block;
      height: 20px;
      margin: 0 12px 0 16px;
    }
  }

  .xw-layout-header--user {
    height: 40px;
    display: flex;
    align-items: center;
    color: $-layout-header-font-color;
    font-size: 14px;
    margin-right: 19px;
    cursor: pointer;

    .user {
      font-size: 16px;
      margin: 0 5px;
    }

    .caret {
      margin: 0 5px;
    }

    .name span {
      display: inline-block;
      transform: translateY(-1px);
    }
  }
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
