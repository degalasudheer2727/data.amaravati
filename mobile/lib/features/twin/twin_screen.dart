import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../data/repository.dart';
import '../../theme.dart';

/// The hybrid heart of the app: the live 3D digital-twin web experience
/// (the same Vercel-hosted site) embedded natively via WebView. One source of
/// truth for the 3D twin, rendered identically on web and mobile.
class TwinScreen extends StatefulWidget {
  final AmaraverseRepository repo;
  const TwinScreen({super.key, required this.repo});

  @override
  State<TwinScreen> createState() => _TwinScreenState();
}

class _TwinScreenState extends State<TwinScreen> {
  late final WebViewController _controller;
  int _progress = 0;
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppColors.bg)
      ..setNavigationDelegate(NavigationDelegate(
        onProgress: (p) => setState(() => _progress = p),
        onPageFinished: (_) => setState(() => _loaded = true),
      ))
      ..loadRequest(Uri.parse(widget.repo.twinUrl));
  }

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      WebViewWidget(controller: _controller),
      if (!_loaded)
        Container(
          color: AppColors.bg,
          alignment: Alignment.center,
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Text('data.amaravati',
                style: AppTheme.display(20, color: AppColors.gold)),
            const SizedBox(height: 14),
            SizedBox(
              width: 180,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _progress / 100,
                  minHeight: 2,
                  backgroundColor: Colors.white12,
                  valueColor: const AlwaysStoppedAnimation(AppColors.saffron),
                ),
              ),
            ),
            const SizedBox(height: 12),
            const Text('Compiling the digital twin…',
                style: TextStyle(
                    color: AppColors.muted2, fontSize: 11, letterSpacing: 2)),
          ]),
        ),
      Positioned(
        top: 50,
        right: 16,
        child: FloatingActionButton.small(
          heroTag: 'reloadTwin',
          backgroundColor: AppColors.surfaceHi,
          foregroundColor: AppColors.gold,
          onPressed: () => _controller.reload(),
          child: const Icon(Icons.refresh),
        ),
      ),
    ]);
  }
}
