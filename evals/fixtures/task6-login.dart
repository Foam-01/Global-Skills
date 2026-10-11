// lib/features/auth/login_page.dart  (project uses Provider for state)
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import 'auth_api.dart';
import 'session_model.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();

  Future<void> _login() async {
    final res = await AuthApi().login(_email.text, _password.text);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', res.accessToken);
    await prefs.setString('refresh_token', res.refreshToken);
    context.read<SessionModel>().setUser(res.user);
    Navigator.of(context).pushReplacementNamed('/home');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(children: [
        TextField(controller: _email),
        TextField(controller: _password, obscureText: true),
        ElevatedButton(onPressed: _login, child: const Text('Login')),
      ]),
    );
  }
}
