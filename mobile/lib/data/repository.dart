import 'package:flutter/material.dart';
import '../models/models.dart';
import '../theme.dart';

/// Decoupled data access. Screens depend on [AmaraverseRepository] (the
/// abstraction), never on a concrete source. Today it returns governed mock
/// data; swap [MockRepository] for an `ApiRepository` to go live without
/// changing a single feature screen.
abstract class AmaraverseRepository {
  List<Kpi> kpis();
  List<Pillar> pillars();
  List<Connector> connectors();
  List<ThemeCity> cities();
  List<FutureFeature> futures();
  List<Signal> liveSignals();

  /// The governed data catalogue + governance model.
  List<ClassTier> classes();
  List<Persona> personas();
  List<Dataset> datasets();
  Persona personaByKey(String key);

  /// The CRDA-governed Data Exchange Hub.
  List<GovEntity> exchangeEntities();
  List<ExchangeStep> exchangeFlow();
  List<ExchangeRecord> exchanges();

  /// The live 3D digital-twin web experience embedded by the Twin screen.
  /// Hosted on Vercel in production; falls back to the bundled asset offline.
  String get twinUrl;
}

class MockRepository implements AmaraverseRepository {
  const MockRepository();

  @override
  String get twinUrl => 'https://amara-twin.vercel.app/';

  @override
  List<Kpi> kpis() => const [
        Kpi('217', ' km²', 'Amaravati capital city'),
        Kpi('1,575', ' ac', 'Government Complex · AGC'),
        Kpi('21', '', 'Land-use zones · R·C·I·P·S·U'),
        Kpi('1.2', 'k+', 'Governed datasets · all tiers'),
      ];

  @override
  List<Pillar> pillars() => const [
        Pillar(
            '01',
            'Statistical Reference',
            'The single source of truth for population, land, economy and infrastructure baselines.',
            AppColors.saffron),
        Pillar(
            '02',
            'Governed Catalogue',
            'Open, internal, sensitive and confidential datasets — each with a licence, schema, owner and access path.',
            AppColors.green),
        Pillar(
            '03',
            'Secure Data Exchange',
            'Governed sharing between agencies and partners with consent and audit trails.',
            AppColors.pulse),
        Pillar(
            '04',
            'Analytics & Foresight',
            'Dashboards, scenario models and AI forecasts that turn the twin into decisions.',
            AppColors.gold),
      ];

  @override
  List<Connector> connectors() => const [
        Connector(
            entity: 'Land & Zoning',
            title: 'Plan & Parcels',
            description:
                'Master-plan land-use zones — R·C·I·P·S·U — parcels, layouts and pooling.',
            icon: Icons.map,
            feeds: ['Zoning', 'Layouts', 'LPS'],
            accent: AppColors.saffron,
            reading: 0.74),
        Connector(
            entity: 'Governance',
            title: 'Civic Pulse',
            description: 'Service requests, permits and citizen sentiment.',
            icon: Icons.balance,
            feeds: ['Grievances', 'Permits', 'e-Services'],
            accent: AppColors.saffron,
            reading: 0.78),
        Connector(
            entity: 'Quantum',
            title: 'Quantum Valley',
            description:
                'Compute capacity, research output and deep-tech activity.',
            icon: Icons.hub,
            feeds: ['Compute', 'R&D', 'Startups'],
            accent: AppColors.cyan,
            reading: 0.38),
        Connector(
            entity: 'Mobility',
            title: 'Move Amaravati',
            description: 'Transit, traffic flow, EV charging and road network.',
            icon: Icons.directions_transit,
            feeds: ['Transit', 'Traffic', 'EV'],
            accent: AppColors.pulse,
            reading: 0.62),
        Connector(
            entity: 'Water',
            title: 'River & Grid',
            description:
                'Krishna riverfront levels, reservoirs and flood resilience.',
            icon: Icons.water_drop,
            feeds: ['River', 'Supply', 'Flood'],
            accent: AppColors.saffron,
            reading: 0.96),
        Connector(
            entity: 'Energy',
            title: 'Green Power',
            description: 'Solar generation, grid load and renewables mix.',
            icon: Icons.bolt,
            feeds: ['Solar', 'Grid', 'Demand'],
            accent: AppColors.gold,
            reading: 0.71),
        Connector(
            entity: 'Housing',
            title: 'Live Here',
            description:
                'Housing stock, affordability and neighbourhood build-out.',
            icon: Icons.holiday_village,
            feeds: ['Stock', 'Pricing', 'Build-out'],
            accent: AppColors.saffron,
            reading: 0.55),
        Connector(
            entity: 'Economy',
            title: 'Capital Markets',
            description: 'Investment, jobs, GVA and sectoral growth.',
            icon: Icons.trending_up,
            feeds: ['Jobs', 'FDI', 'GVA'],
            accent: AppColors.green,
            reading: 0.66),
        Connector(
            entity: 'Demographics',
            title: 'People & Place',
            description:
                'Population, density and the human texture of each ward.',
            icon: Icons.groups,
            feeds: ['Census', 'Density', 'Wards'],
            accent: AppColors.saffron,
            reading: 0.6),
        Connector(
            entity: 'Construction',
            title: 'Build Watch',
            description:
                'Live progress on the government spine and capital works.',
            icon: Icons.construction,
            feeds: ['Projects', 'Progress', 'Spend'],
            accent: AppColors.saffron,
            reading: 0.64),
        Connector(
            entity: 'Environment',
            title: 'Air & Green',
            description: 'Air quality, green cover and the blue-green network.',
            icon: Icons.eco,
            feeds: ['AQI', 'Canopy', 'Parks'],
            accent: AppColors.saffron,
            reading: 0.83),
        Connector(
            entity: 'Heritage',
            title: 'Amara Roots',
            description: 'Buddhist heritage, the stupa and cultural memory.',
            icon: Icons.account_balance,
            feeds: ['Sites', 'Tourism', 'Archive'],
            accent: AppColors.maroon,
            reading: 0.5),
        Connector(
            entity: 'Safety',
            title: 'Safe City',
            description:
                'Emergency response, disaster readiness and safety signals.',
            icon: Icons.shield,
            feeds: ['112', 'Disaster', 'CCTV'],
            accent: AppColors.saffron,
            reading: 0.9),
      ];

  @override
  List<ThemeCity> cities() => const [
        ThemeCity('Government City', 'పరిపాలన నగరం',
            'The legislative & administrative spine.', AppColors.saffron, 142),
        ThemeCity('Justice City', 'న్యాయ నగరం',
            'High Court & judicial precinct.', AppColors.gold, 64),
        ThemeCity('Finance City', 'ఆర్థిక నగరం', 'Banking, markets & capital.',
            AppColors.green, 88),
        ThemeCity('Knowledge City', 'విజ్ఞాన నగరం', 'Universities & research.',
            AppColors.pulse, 121),
        ThemeCity('Health City', 'ఆరోగ్య నగరం', 'Hospitals & life sciences.',
            AppColors.saffron, 77),
        ThemeCity('Sports City', 'క్రీడా నగరం', 'Stadia & athletic venues.',
            AppColors.cyan, 39),
        ThemeCity('Media City', 'మీడియా నగరం', 'Film, broadcast & creative.',
            AppColors.saffron, 45),
        ThemeCity('Tourism City', 'పర్యాటక నగరం',
            'Riverfront, culture & leisure.', AppColors.saffron, 58),
        ThemeCity('Electronics City', 'ఎలక్ట్రానిక్స్ నగరం',
            'Manufacturing & deep-tech.', AppColors.saffron, 83),
        ThemeCity('Quantum Valley', 'క్వాంటం వ్యాలీ',
            'Quantum compute & frontier R&D.', AppColors.saffron, 96),
      ];

  /// Forward-looking capability roadmap — the digital city of 2040.
  @override
  List<FutureFeature> futures() => const [
        FutureFeature(
            horizon: '2030',
            title: 'AI Civic Co-pilot',
            description:
                'A multilingual assistant that answers any question about the city and files services for you.',
            icon: Icons.auto_awesome,
            accent: AppColors.saffron),
        FutureFeature(
            horizon: '2030',
            title: 'Decentralised Digital ID',
            description:
                'Self-sovereign identity & verifiable credentials for every resident, consent-first.',
            icon: Icons.badge,
            accent: AppColors.pulse),
        FutureFeature(
            horizon: '2032',
            title: 'CBDC & Programmable Payments',
            description:
                'e-Rupee wallet for fees, subsidies and micro-payments built into the city OS.',
            icon: Icons.payments,
            accent: AppColors.green),
        FutureFeature(
            horizon: '2033',
            title: 'Autonomous Mobility Mesh',
            description:
                'Self-driving shuttles, drone logistics and a unified MaaS booking layer.',
            icon: Icons.smart_toy,
            accent: AppColors.cyan),
        FutureFeature(
            horizon: '2035',
            title: 'AR Twin Overlay',
            description:
                'Point your phone or glasses at any street and see live data painted onto reality.',
            icon: Icons.view_in_ar,
            accent: AppColors.gold),
        FutureFeature(
            horizon: '2035',
            title: 'Predictive Governance',
            description:
                'The twin forecasts floods, congestion and demand and pre-positions resources.',
            icon: Icons.insights,
            accent: AppColors.saffron),
        FutureFeature(
            horizon: '2036',
            title: 'Net-Zero Energy Twin',
            description:
                'Real-time carbon ledger; every building, grid and vehicle optimised to net-zero.',
            icon: Icons.energy_savings_leaf,
            accent: AppColors.saffron),
        FutureFeature(
            horizon: '2038',
            title: 'Quantum-Secured Exchange',
            description:
                'Post-quantum cryptography securing every inter-agency data transaction.',
            icon: Icons.lock,
            accent: AppColors.saffron),
        FutureFeature(
            horizon: '2040',
            title: 'Sentient City OS',
            description:
                'A federated, privacy-preserving AI orchestrating the whole capital in real time.',
            icon: Icons.psychology,
            accent: AppColors.maroon),
        FutureFeature(
            horizon: '2040',
            title: 'Citizen DAO Budgeting',
            description:
                'Residents co-allocate participatory budgets on-chain, ward by ward.',
            icon: Icons.how_to_vote,
            accent: AppColors.saffron),
      ];

  @override
  List<Signal> liveSignals() => const [
        Signal('Krishna riverfront level', '12.4 m'),
        Signal('Government Complex works', '64%'),
        Signal('Inner Ring Road flow', 'Free'),
        Signal('Capital-city AQI', '71 · Good'),
        Signal('Solar generation today', '1.9 GWh'),
        Signal('Open datasets published', '1,240'),
        Signal('Transit ridership w/w', '+6.2%'),
        Signal('Green canopy cover', '31%'),
      ];

  @override
  List<ClassTier> classes() => const [
        ClassTier(
            Classification.public,
            'బహిరంగ',
            'Open data anyone can use, share and build on under an open licence.',
            'Instant download / open API · no sign-in needed'),
        ClassTier(
            Classification.internal,
            'అంతర్గత',
            'Operational data shared across agencies and verified partners.',
            'Signed-in request, API key issued · access logged'),
        ClassTier(
            Classification.restricted,
            'పరిమిత',
            'Sensitive or commercially valuable data needing a data-sharing agreement.',
            'Agreement + purpose review · time-boxed, consent-bound'),
        ClassTier(
            Classification.confidential,
            'గోప్యం',
            'Personal, security or individually-identifying records — strict need-to-know.',
            'Closed · DPO approval, need-to-know, full audit'),
      ];

  @override
  List<Persona> personas() => const [
        Persona(
            key: 'citizen',
            title: 'Citizen',
            telugu: 'పౌరుడు',
            description:
                'Residents exploring their ward — services, air, water and build progress.',
            icon: Icons.person,
            access: {
              Classification.public: Access.instant,
              Classification.internal: Access.closed,
              Classification.restricted: Access.closed,
              Classification.confidential: Access.closed,
            }),
        Persona(
            key: 'researcher',
            title: 'Researcher · Academia',
            telugu: 'పరిశోధకుడు',
            description:
                'Universities & analysts working on aggregate, de-identified data.',
            icon: Icons.school,
            access: {
              Classification.public: Access.instant,
              Classification.internal: Access.agreement,
              Classification.restricted: Access.agreement,
              Classification.confidential: Access.closed,
            }),
        Persona(
            key: 'startup',
            title: 'Startup · Enterprise',
            telugu: 'సంస్థ',
            description:
                'Builders shipping products on governed commercial feeds and APIs.',
            icon: Icons.rocket_launch,
            access: {
              Classification.public: Access.instant,
              Classification.internal: Access.instant,
              Classification.restricted: Access.closed,
              Classification.confidential: Access.closed,
            }),
        Persona(
            key: 'agency',
            title: 'Government Agency',
            telugu: 'ప్రభుత్వ సంస్థ',
            description:
                'Departments exchanging operational data under governed agreements.',
            icon: Icons.account_balance,
            access: {
              Classification.public: Access.instant,
              Classification.internal: Access.instant,
              Classification.restricted: Access.instant,
              Classification.confidential: Access.agreement,
            }),
        Persona(
            key: 'partner',
            title: 'Infrastructure Partner',
            telugu: 'భాగస్వామి',
            description:
                'Utilities & concessionaires operating city systems at scale.',
            icon: Icons.handshake,
            access: {
              Classification.public: Access.instant,
              Classification.internal: Access.instant,
              Classification.restricted: Access.instant,
              Classification.confidential: Access.closed,
            }),
        Persona(
            key: 'steward',
            title: 'Data Steward',
            telugu: 'డేటా స్టీవార్డ్',
            description:
                'Custodians who publish, classify and govern the catalogue.',
            icon: Icons.verified_user,
            access: {
              Classification.public: Access.instant,
              Classification.internal: Access.instant,
              Classification.restricted: Access.instant,
              Classification.confidential: Access.instant,
            }),
      ];

  @override
  Persona personaByKey(String key) => personas()
      .firstWhere((p) => p.key == key, orElse: () => personas().first);

  @override
  List<Dataset> datasets() => const [
        Dataset(
            entity: 'Land & Zoning',
            title: 'Land-Use Zoning Parcels',
            description:
                'Every parcel by zone family — R·C·I·P·S·U — from the Detailed Master Plan.',
            format: 'GeoJSON',
            cadence: 'On revision',
            owner: 'APCRDA Planning',
            classification: Classification.public),
        Dataset(
            entity: 'Land & Zoning',
            title: 'Layout & Plot Sanctions',
            description:
                'Approved layouts, sub-division and plot-level sanction status.',
            format: 'REST API',
            cadence: 'Daily',
            owner: 'DTCP · APCRDA',
            classification: Classification.internal),
        Dataset(
            entity: 'Land & Zoning',
            title: 'Land-Pooling (LPS) Returns',
            description:
                'Returnable-plot allotments against pooled survey numbers across 29 villages.',
            format: 'API',
            cadence: 'Weekly',
            owner: 'APCRDA',
            classification: Classification.restricted),
        Dataset(
            entity: 'Governance',
            title: 'Citizen Grievances (PGRS)',
            description:
                'Service requests and resolution times across the capital city.',
            format: 'CSV · API',
            cadence: 'Daily',
            owner: 'Citizen Services',
            classification: Classification.public),
        Dataset(
            entity: 'Governance',
            title: 'Building Permits & Occupancy',
            description:
                'Permit pipeline, approvals and occupancy certificates.',
            format: 'REST API',
            cadence: 'Hourly',
            owner: 'APCRDA Planning',
            classification: Classification.internal),
        Dataset(
            entity: 'Governance',
            title: 'Official Action & Approval Logs',
            description:
                'Identifiable officer decision and file-movement audit trail.',
            format: '—',
            cadence: '—',
            owner: 'APCRDA',
            classification: Classification.confidential),
        Dataset(
            entity: 'Mobility',
            title: 'Inner Ring Road Traffic Flow',
            description:
                'Speed and volume across the IRR and arterial 60/50/25 m network.',
            format: 'GeoJSON',
            cadence: '5 min',
            owner: 'Transport Dept',
            classification: Classification.public),
        Dataset(
            entity: 'Mobility',
            title: 'Public Transit Positions',
            description:
                'Live bus/metro vehicle positions for the capital region.',
            format: 'GTFS-RT',
            cadence: '15 sec',
            owner: 'APSRTC',
            classification: Classification.public),
        Dataset(
            entity: 'Mobility',
            title: 'ANPR Vehicle Movements',
            description: 'Number-plate transit records at key junctions.',
            format: 'API',
            cadence: 'Real-time',
            owner: 'Traffic Police',
            classification: Classification.restricted),
        Dataset(
            entity: 'Water',
            title: 'Krishna Riverfront & Bund Levels',
            description:
                'River stage and bund-road levels along the northern edge.',
            format: 'REST API',
            cadence: '10 min',
            owner: 'Irrigation',
            classification: Classification.public),
        Dataset(
            entity: 'Water',
            title: 'Reservoir & Supply (SCADA)',
            description:
                'Pump-house pressure, storage and distribution telemetry.',
            format: '—',
            cadence: 'Real-time',
            owner: 'Water Utility',
            classification: Classification.restricted),
        Dataset(
            entity: 'Environment',
            title: 'Air Quality Index (CAAQMS)',
            description:
                'Continuous ambient air-quality monitoring across stations.',
            format: 'REST API',
            cadence: 'Hourly',
            owner: 'APPCB',
            classification: Classification.public),
        Dataset(
            entity: 'Economy',
            title: 'Sectoral GVA, Jobs & Output',
            description:
                'Headline economic indicators by sector for the capital.',
            format: 'CSV',
            cadence: 'Quarterly',
            owner: 'Economic Dev',
            classification: Classification.public),
        Dataset(
            entity: 'Economy',
            title: 'FDI & Investment Pipeline',
            description:
                'Committed and in-pipeline investment by zone and sector.',
            format: 'API',
            cadence: 'Weekly',
            owner: 'AP EDB',
            classification: Classification.internal),
        Dataset(
            entity: 'Housing',
            title: 'Property Registration Prices',
            description: 'Plot-level registered transaction values.',
            format: '—',
            cadence: 'Daily',
            owner: 'Registration & Stamps',
            classification: Classification.restricted),
        Dataset(
            entity: 'Demographics',
            title: 'Ward Population & Density',
            description: 'Population, households and density by ward and zone.',
            format: 'CSV',
            cadence: 'Annual',
            owner: 'DES',
            classification: Classification.public),
        Dataset(
            entity: 'Demographics',
            title: 'Individual Land-Loser Records',
            description:
                'Identifiable farmer/land-loser records under land pooling.',
            format: '—',
            cadence: '—',
            owner: 'APCRDA',
            classification: Classification.confidential),
        Dataset(
            entity: 'Construction',
            title: 'Government Complex (AGC) Progress',
            description:
                'Works progress across the ~1,575-acre Government Complex.',
            format: 'REST API',
            cadence: 'Daily',
            owner: 'APCRDA',
            classification: Classification.public),
        Dataset(
            entity: 'Safety',
            title: 'Emergency Response (112) Times',
            description:
                'Aggregate response times for police, fire and medical.',
            format: 'API',
            cadence: 'Daily',
            owner: 'Police · DM',
            classification: Classification.public),
        Dataset(
            entity: 'Safety',
            title: 'Command Centre Incident Feeds',
            description: 'Live CCTV-linked incident and surveillance feeds.',
            format: '—',
            cadence: '—',
            owner: 'Police',
            classification: Classification.confidential),
      ];

  @override
  List<GovEntity> exchangeEntities() => const [
        GovEntity(
            abbr: 'APCRDA',
            name: 'Capital Region Dev. Authority',
            role: 'Governing authority',
            icon: Icons.account_balance,
            published: 9,
            consumed: 5,
            color: AppColors.gold,
            governs: true),
        GovEntity(
            abbr: 'DTCP',
            name: 'Town & Country Planning',
            role: 'Provider · Consumer',
            icon: Icons.architecture,
            published: 3,
            consumed: 2,
            color: AppColors.saffron),
        GovEntity(
            abbr: 'Irrigation',
            name: 'Water Resources Dept',
            role: 'Provider',
            icon: Icons.water_drop,
            published: 2,
            consumed: 1,
            color: AppColors.saffron),
        GovEntity(
            abbr: 'APSRTC',
            name: 'Road Transport Corp.',
            role: 'Provider · Consumer',
            icon: Icons.directions_bus,
            published: 2,
            consumed: 2,
            color: AppColors.pulse),
        GovEntity(
            abbr: 'APPCB',
            name: 'Pollution Control Board',
            role: 'Provider',
            icon: Icons.eco,
            published: 2,
            consumed: 1,
            color: AppColors.saffron),
        GovEntity(
            abbr: 'AP Police',
            name: 'Police & Command Centre',
            role: 'Provider · Consumer',
            icon: Icons.shield,
            published: 2,
            consumed: 3,
            color: AppColors.saffron),
        GovEntity(
            abbr: 'Reg. & Stamps',
            name: 'Registration & Stamps',
            role: 'Provider',
            icon: Icons.receipt_long,
            published: 1,
            consumed: 1,
            color: AppColors.saffron),
        GovEntity(
            abbr: 'AP EDB',
            name: 'Economic Development Board',
            role: 'Consumer',
            icon: Icons.trending_up,
            published: 1,
            consumed: 4,
            color: AppColors.green),
        GovEntity(
            abbr: 'DES',
            name: 'Economics & Statistics',
            role: 'Provider · Consumer',
            icon: Icons.bar_chart,
            published: 3,
            consumed: 3,
            color: AppColors.saffron),
        GovEntity(
            abbr: 'Transport',
            name: 'Transport Department',
            role: 'Provider · Consumer',
            icon: Icons.traffic,
            published: 2,
            consumed: 2,
            color: AppColors.pulse),
        GovEntity(
            abbr: 'Water Utility',
            name: 'City Water Utility',
            role: 'Provider',
            icon: Icons.water,
            published: 1,
            consumed: 2,
            color: AppColors.cyan),
        GovEntity(
            abbr: 'ULBs',
            name: 'Urban Local Bodies',
            role: 'Consumer',
            icon: Icons.location_city,
            published: 1,
            consumed: 5,
            color: AppColors.saffron),
      ];

  @override
  List<ExchangeStep> exchangeFlow() => const [
        ExchangeStep('01', 'Request',
            'A consumer entity requests a dataset from a provider through the hub.'),
        ExchangeStep('02', 'Classify & route',
            'The hub tags the data\'s confidentiality tier and routes it by policy.'),
        ExchangeStep('03', 'CRDA review',
            'CRDA verifies purpose, legal basis and DPDP / consent compliance.',
            crda: true),
        ExchangeStep('04', 'Agreement',
            'A signed, time-boxed, consent-bound data-sharing agreement is registered.',
            crda: true),
        ExchangeStep('05', 'Provision',
            'A secure API / exchange channel is opened between the two entities.'),
        ExchangeStep('06', 'Audit',
            'Every transaction is logged; CRDA monitors and can revoke access.',
            crda: true),
      ];

  @override
  List<ExchangeRecord> exchanges() => const [
        ExchangeRecord(
            provider: 'DTCP',
            consumer: 'APCRDA',
            dataset: 'Layout & Plot Sanctions',
            classification: Classification.internal,
            status: ExchangeStatus.active,
            purpose: 'Master-plan compliance'),
        ExchangeRecord(
            provider: 'Irrigation',
            consumer: 'APCRDA',
            dataset: 'Krishna Riverfront Levels',
            classification: Classification.public,
            status: ExchangeStatus.active,
            purpose: 'Flood resilience'),
        ExchangeRecord(
            provider: 'AP Police',
            consumer: 'Transport',
            dataset: 'ANPR Vehicle Movements',
            classification: Classification.restricted,
            status: ExchangeStatus.review,
            purpose: 'Corridor congestion modelling'),
        ExchangeRecord(
            provider: 'Reg. & Stamps',
            consumer: 'AP EDB',
            dataset: 'Property Registration Prices',
            classification: Classification.restricted,
            status: ExchangeStatus.agreement,
            purpose: 'Land-value baselining'),
        ExchangeRecord(
            provider: 'APPCB',
            consumer: 'ULBs',
            dataset: 'Air Quality Index',
            classification: Classification.public,
            status: ExchangeStatus.active,
            purpose: 'Ward health dashboards'),
        ExchangeRecord(
            provider: 'DES',
            consumer: 'APCRDA',
            dataset: 'Ward Population & Density',
            classification: Classification.public,
            status: ExchangeStatus.active,
            purpose: 'Service planning'),
        ExchangeRecord(
            provider: 'APCRDA',
            consumer: 'AP Police',
            dataset: 'Individual Land-Loser Records',
            classification: Classification.confidential,
            status: ExchangeStatus.declined,
            purpose: 'Identity verification'),
        ExchangeRecord(
            provider: 'Water Utility',
            consumer: 'APCRDA',
            dataset: 'Reservoir & Supply (SCADA)',
            classification: Classification.restricted,
            status: ExchangeStatus.agreement,
            purpose: 'Demand forecasting'),
        ExchangeRecord(
            provider: 'APSRTC',
            consumer: 'Transport',
            dataset: 'Public Transit Positions',
            classification: Classification.public,
            status: ExchangeStatus.active,
            purpose: 'Multimodal routing'),
      ];
}
