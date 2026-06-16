import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// data.amaravati brand system — India tricolour-derived, govt-credible, enterprise-grade.
/// Mirrors the 3D website palette so the hybrid app and site feel like one product.
class AppColors {
  // 3-colour system: ink (base) · snow (foreground) · saffron (single accent).
  static const ink = Color(0xFF080B12);
  static const snow = Color(0xFFEEF2F8);
  static const saffron = Color(0xFFFF9F43);

  static const bg = ink;
  static const bg2 = Color(0xFF0A0E16);
  static const surface = Color(0x0DFFFFFF); // translucent glass
  static const surfaceHi = Color(0xFF141A26); // opaque (avatars, dropdowns)
  static const surfaceSolid = Color(0xFF0F141E); // opaque base
  static const line = Color(0x1FFFFFFF); // white @ .12

  // legacy accent names collapse onto the single accent
  static const green = saffron;
  static const navy = ink;
  static const pulse = saffron;
  static const gold = saffron;
  static const cyan = saffron;
  static const maroon = saffron;

  static const text = snow;
  static const muted = Color(0x99EEF2F8); // .60
  static const muted2 = Color(0x61EEF2F8); // .38
}

class AppTheme {
  static ThemeData get dark {
    final base = ThemeData.dark(useMaterial3: true);
    final textTheme = GoogleFonts.interTextTheme(base.textTheme).apply(
      bodyColor: AppColors.text,
      displayColor: AppColors.text,
    );
    return base.copyWith(
      scaffoldBackgroundColor: AppColors.bg,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.saffron,
        secondary: AppColors.saffron,
        surface: AppColors.surfaceSolid,
        onPrimary: Color(0xFF1A1205),
      ),
      textTheme: textTheme,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        foregroundColor: AppColors.text,
      ),
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.line),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.bg2,
        selectedItemColor: AppColors.saffron,
        unselectedItemColor: AppColors.muted2,
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
      ),
    );
  }

  /// Serif display style used for big headlines (echoes the website's Georgia).
  static TextStyle display(double size,
          {Color? color, FontWeight w = FontWeight.w400}) =>
      GoogleFonts.notoSerif(
          fontSize: size,
          color: color ?? AppColors.text,
          fontWeight: w,
          height: 1.05);

  static TextStyle telugu(double size, {Color? color}) =>
      GoogleFonts.notoSansTelugu(
          fontSize: size, color: color ?? AppColors.saffron);
}
