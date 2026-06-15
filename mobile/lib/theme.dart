import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// data.amaravati brand system — India tricolour-derived, govt-credible, enterprise-grade.
/// Mirrors the 3D website palette so the hybrid app and site feel like one product.
class AppColors {
  static const bg = Color(0xFF05070E);
  static const bg2 = Color(0xFF080C18);
  static const surface = Color(0xFF0B1124);
  static const surfaceHi = Color(0xFF101830);
  static const line = Color(0x14FFFFFF);

  static const saffron = Color(0xFFFF9933);
  static const green = Color(0xFF138808);
  static const navy = Color(0xFF0A1F44);
  static const pulse = Color(0xFF3B7BFF); // Ashoka-chakra live accent
  static const gold = Color(0xFFE7C46B);
  static const cyan = Color(0xFF34E0D8);
  static const maroon = Color(0xFF7A1F2B);

  static const text = Color(0xFFEEF2FB);
  static const muted = Color(0xFF9FB0CC);
  static const muted2 = Color(0xFF6C7E9E);
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
        secondary: AppColors.gold,
        surface: AppColors.surface,
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
