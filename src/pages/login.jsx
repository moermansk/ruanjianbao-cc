// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Lock, User, LogIn, Smartphone } from 'lucide-react';
// @ts-ignore;
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, useToast } from '@/components/ui';

import { useForm } from 'react-hook-form';
export default function LoginPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // 检查是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 检查 localStorage 中是否有登录状态
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (isLoggedIn === 'true') {
          // 已登录，直接跳转到管理后台
          $w.utils.navigateTo({
            pageId: 'dashboard',
            params: {}
          });
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // 检查登录状态时显示加载
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在检查登录状态...</p>
        </div>
      </div>;
  }
  const onSubmit = async values => {
    // 验证用户名
    if (!values.username || values.username.length < 4 || values.username.length > 20) {
      form.setError('username', {
        type: 'manual',
        message: '用户名需4-20个字符'
      });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
      form.setError('username', {
        type: 'manual',
        message: '用户名只能包含字母、数字和下划线'
      });
      return;
    }

    // 验证密码
    if (!values.password || values.password.length < 8 || values.password.length > 32) {
      form.setError('password', {
        type: 'manual',
        message: '密码需8-32个字符'
      });
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(values.password)) {
      form.setError('password', {
        type: 'manual',
        message: '密码必须包含字母和数字'
      });
      return;
    }
    try {
      setIsLoading(true);

      // 硬编码的用户名和密码验证
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = 'admin@123';
      if (values.username === ADMIN_USERNAME && values.password === ADMIN_PASSWORD) {
        // 登录成功，设置登录状态
        localStorage.setItem('admin_logged_in', 'true');
        toast({
          title: '登录成功',
          description: '欢迎回来！'
        });

        // 跳转到管理后台
        setTimeout(() => {
          $w.utils.navigateTo({
            pageId: 'dashboard',
            params: {}
          });
        }, 500);
      } else {
        // 登录失败
        toast({
          title: '登录失败',
          description: '用户名或密码错误',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('登录失败:', error);

      // 显示错误提示
      toast({
        title: '登录失败',
        description: '登录过程中发生错误',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">管理后台登录</h1>
            <p className="text-gray-500">请输入您的账号和密码</p>
          </div>

          {/* 登录表单 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 用户名输入框 */}
              <FormField control={form.control} name="username" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-gray-700 font-medium">用户名</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input placeholder="请输入用户名" className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              {/* 密码输入框 */}
              <FormField control={form.control} name="password" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-gray-700 font-medium">密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input type="password" placeholder="请输入密码" className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              {/* 登录按钮 */}
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium text-base" disabled={isLoading}>
                {isLoading ? <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    登录中...
                  </span> : <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    登录
                  </span>}
              </Button>
            </form>
          </Form>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm text-orange-700 text-center">
              <span className="font-medium">提示：</span>
              用户名需4-20位，密码需8-32位且包含字母和数字
            </p>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Smartphone className="w-4 h-4" />
            <span>烧烤点餐系统 · 管理后台</span>
          </div>
        </div>
      </div>
    </div>;
}