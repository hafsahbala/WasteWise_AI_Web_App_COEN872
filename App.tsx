import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  Database,
  Download,
  FileText,
  Gauge,
  Layers3,
  Leaf,
  LocateFixed,
  Map,
  MapPin,
  Menu,
  Minus,
  Navigation,
  Plus,
  Recycle,
  Route,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Navigate,
  Route as RouterRoute,
  Routes,
  useLocation,
} from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { Hotspot, WasteCategory, WasteObservation, CollectionStatus } from "./types/waste";

type Notice = { title: string; detail: string };
type PageProps = { notify: (notice: Notice) => void };

const navigation = [
  { title: "Workspace", items: [{ label: "Overview", path: "/", icon: Gauge }, { label: "Hotspot map", path: "/map", icon: Map }, { label: "Waste records", path: "/records", icon: Layers3 }] },
  { title: "Intelligence", items: [{ label: "Forecasting", path: "/forecasting", icon: Sparkles }, { label: "Collection planning", path: "/planning", icon: Route }, { label: "Reports & analytics", path: "/reports", icon: BarChart3 }] },
  { title: "Configuration", items: [{ label: "System setup", path: "/setup", icon: Settings2 }] },
];

const categories: WasteCategory[] = ["Household", "Commercial", "Organic", "Plastic", "Construction", "Other"];
const statuses: CollectionStatus[] = ["Pending", "Collected", "In progress"];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const notify = (next: Notice) => setNotice(next);
  const location = useLocation();

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Link className="brand" to="/" onClick={() => setSidebarOpen(false)}>
          <span className="brand-mark"><Recycle size={20} strokeWidth={2.2} /></span>
          <span className="brand-copy"><strong>WasteWise<span> AI</span></strong><small>SMARTER CITY OPERATIONS</small></span>
        </Link>
        <div className="workspace-picker">
          <span className="workspace-avatar">W</span>
          <span><strong>Research workspace</strong><small>Frontend prototype</small></span>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((group) => (
            <section className="nav-group" key={group.title}>
              <p className="nav-heading">{group.title}</p>
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}
                >
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-support">
            <span className="support-icon"><CircleHelp size={17} /></span>
            <div><strong>Building your pilot?</strong><small>Review the integration guide</small></div>
            <Link aria-label="Open system setup" to="/setup"><ArrowRight size={15} /></Link>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">R</div>
            <div className="user-copy"><strong>Research team</strong><small>Local workspace</small></div>
            <button className="icon-button user-menu" aria-label="Open workspace settings" onClick={() => notify({ title: "Workspace preferences", detail: "Workspace preferences will be available in a future release." })}><ChevronDown size={16} /></button>
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>WasteWise AI</span><ChevronRight size={14} /><strong>{pageTitle(location.pathname)}</strong></div>
          <div className="topbar-actions">
            <span className="connection-pill"><span />AI services not connected</span>
            <button className="icon-button top-help" aria-label="View integration status" onClick={() => notify({ title: "Integration status", detail: "The frontend is ready. Dataset and AI services have not been connected." })}><Bell size={18} /><i /></button>
            <div className="top-avatar" title="Research workspace">R</div>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <RouterRoute path="/" element={<DashboardPage notify={notify} />} />
            <RouterRoute path="/map" element={<HotspotMapPage notify={notify} />} />
            <RouterRoute path="/records" element={<WasteRecordsPage notify={notify} />} />
            <RouterRoute path="/forecasting" element={<ForecastingPage notify={notify} />} />
            <RouterRoute path="/planning" element={<PlanningPage notify={notify} />} />
            <RouterRoute path="/reports" element={<ReportsPage notify={notify} />} />
            <RouterRoute path="/setup" element={<SetupPage notify={notify} />} />
            <RouterRoute path="/not-found" element={<NotFoundPage />} />
            <RouterRoute path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </main>
      </div>
      {notice && <div className="toast" role="status"><span className="toast-check"><Check size={16} /></span><div><strong>{notice.title}</strong><p>{notice.detail}</p></div><button className="icon-button" aria-label="Dismiss message" onClick={() => setNotice(null)}><X size={16} /></button></div>}
    </div>
  );
}

function pageTitle(path: string) {
  return navigation.flatMap((group) => group.items).find((item) => item.path === path)?.label ?? "Page not found";
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" }) {
  return <span className={`status-badge status-${tone}`}><span />{children}</span>;
}

function EmptyState({ icon: Icon = Database, title, detail, action }: { icon?: typeof Database; title: string; detail: string; action?: React.ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={21} strokeWidth={1.8} /></div><h3>{title}</h3><p>{detail}</p>{action}</div>;
}

function MetricCard({ label, detail, icon: Icon }: { label: string; detail: string; icon: typeof MapPin }) {
  return <div className="metric-card"><div className="metric-top"><span className="metric-icon"><Icon size={17} /></span><span className="metric-dash"><Minus size={16} /></span></div><p className="metric-value">—</p><p className="metric-label">{label}</p><p className="metric-detail">{detail}</p></div>;
}

function MapCanvas({ hotspots = [], compact = false, emptyMessage }: { hotspots?: Hotspot[]; compact?: boolean; emptyMessage?: string }) {
  return (
    <div className={`map-canvas${compact ? " map-compact" : ""}`}>
      <MapContainer center={[9.08, 8.67]} zoom={compact ? 5 : 6} scrollWheelZoom={!compact} zoomControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotspots.map((hotspot) => (
          <CircleMarker key={hotspot.id} center={[hotspot.latitude, hotspot.longitude]} radius={8} pathOptions={{ color: hotspot.severity === "high" ? "#b45309" : "#21865a", fillOpacity: 0.8 }}>
            <Popup><strong>{hotspot.locationName}</strong><br />{hotspot.observedVolumeKg} kg · {hotspot.predictionStatus}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {hotspots.length === 0 && <div className="map-empty-overlay"><div className="map-empty-card"><span className="map-pin-empty"><MapPin size={18} /></span><strong>{emptyMessage ?? "No hotspot data connected"}</strong><span>Map navigation only · no observations displayed</span></div></div>}
      <span className="map-context-tag"><LocateFixed size={13} /> Regional map · no study area selected</span>
    </div>
  );
}

function DashboardPage({ notify }: PageProps) {
  return (
    <>
      <div className="welcome-panel">
        <div className="welcome-orb orb-one" /><div className="welcome-orb orb-two" />
        <div className="welcome-copy">
          <p className="eyebrow welcome-eyebrow"><Leaf size={14} /> WASTEWISE AI · PROJECT WORKSPACE</p>
          <h1>Smarter waste management.<br /><span>Cleaner communities.</span></h1>
          <p>An AI-powered municipal waste platform designed to support hotspot monitoring, demand forecasting, and optimized collection planning.</p>
          <div className="welcome-meta"><StatusBadge tone="green">Frontend ready</StatusBadge><span className="meta-divider" /><span><Clock3 size={14} /> AI integration pending</span></div>
          <Link className="button button-light" to="/setup">Prepare your integration <ArrowRight size={16} /></Link>
        </div>
        <div className="welcome-art" aria-hidden="true"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-core"><Recycle size={43} strokeWidth={1.2} /></div><span className="art-leaf leaf-a"><Leaf size={19} /></span><span className="art-leaf leaf-b"><Leaf size={15} /></span><span className="art-node node-a" /><span className="art-node node-b" /></div>
        <div className="welcome-caption">DESIGNED FOR RESPONSIBLE CITY OPERATIONS</div>
      </div>

      <div className="section-title-row"><div><h2>Operations snapshot</h2><p>Live indicators will appear when verified data is connected.</p></div><span className="updated-note"><span className="dot-muted" /> Awaiting data</span></div>
      <div className="metrics-grid">
        <MetricCard label="Waste hotspots" detail="Awaiting verified observations" icon={MapPin} />
        <MetricCard label="Pending collections" detail="Collection records not connected" icon={Truck} />
        <MetricCard label="Forecasted demand" detail="AI model not connected" icon={Activity} />
        <MetricCard label="Route plans" detail="Optimization service not connected" icon={Navigation} />
      </div>

      <div className="dashboard-grid">
        <section className="panel map-preview-panel">
          <div className="panel-heading"><div><h2>Waste hotspot overview</h2><p>Map navigation is available; hotspot layers await real data.</p></div><Link className="text-link" to="/map">Open map <ArrowRight size={15} /></Link></div>
          <MapCanvas compact />
        </section>
        <section className="panel forecast-preview">
          <div className="panel-heading"><div><h2>Waste demand forecast</h2><p>Forecast insights for connected locations</p></div><span className="panel-icon"><Activity size={17} /></span></div>
          <div className="chart-placeholder">
            <div className="chart-y-labels"><span>—</span><span>—</span><span>—</span><span>—</span></div>
            <div className="chart-grid-lines"><i /><i /><i /><i /></div>
            <div className="chart-watermark"><div className="chart-mark"><BarChart3 size={22} /></div><strong>No predictions available</strong><span>Connect a dataset and forecasting model to view trends.</span><Link to="/forecasting">Explore forecasting <ArrowRight size={14} /></Link></div>
            <div className="chart-x-labels"><span>Start</span><span>Forecast period</span><span>End</span></div>
          </div>
          <div className="forecast-footnote"><span><span className="legend-line" /> Observed</span><span><span className="legend-line legend-dashed" /> Predicted</span><span className="model-tag">MODEL NOT CONNECTED</span></div>
        </section>
      </div>

      <div className="dashboard-grid lower-grid">
        <section className="panel planning-preview">
          <div className="panel-heading"><div><h2>Collection planning</h2><p>Build a plan from verified stops and vehicle constraints.</p></div><span className="panel-icon"><Route size={17} /></span></div>
          <div className="planning-empty">
            <div className="route-illustration"><span className="route-point point-start"><MapPin size={14} /></span><i /><i /><span className="route-point point-end"><Truck size={14} /></span></div>
            <div><strong>Route optimization is not connected</strong><p>Real collection points, road-network information, and an optimization service are required.</p><Link className="text-link" to="/planning">Open planning workspace <ArrowRight size={14} /></Link></div>
          </div>
        </section>
        <section className="panel activity-panel">
          <div className="panel-heading"><div><h2>Recent activity</h2><p>Updates from your connected workspace</p></div><span className="panel-icon"><Clock3 size={17} /></span></div>
          <EmptyState icon={Activity} title="Nothing to report yet" detail="Activity will appear here after records or services are connected." />
        </section>
      </div>
      <IntegrationBanner notify={notify} />
    </>
  );
}

function IntegrationBanner({ notify }: PageProps) {
  return <div className="integration-banner"><span className="banner-icon"><Database size={19} /></span><div><strong>Start with a credible dataset</strong><p>Inspect your source data, document its provenance, and connect an API when the integration is ready.</p></div><button className="button button-outline" onClick={() => notify({ title: "Integration checklist", detail: "Open System setup for the dataset-to-interface integration workflow." })}>View integration guide <ArrowRight size={15} /></button></div>;
}

function HotspotMapPage({ notify }: PageProps) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  return (
    <>
      <PageHeading eyebrow="MONITORING" title="Hotspot map" description="Explore the map surface and prepare location filters for future verified observations." actions={<button className="button button-outline" onClick={() => notify({ title: "No hotspot layer available", detail: "Connect verified observation data before hotspot locations can be displayed." })}><Layers3 size={16} /> Hotspot layer <span className="button-status">Unavailable</span></button>} />
      <div className="filters-toolbar map-filters">
        <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a location" aria-label="Search a location" /></label>
        <label className="select-field"><span>Severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option value="all">All severity levels</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><ChevronDown size={14} /></label>
        <label className="date-filter"><CalendarDays size={15} /><input type="date" aria-label="Filter from date" /></label>
        <label className="date-filter"><span>to</span><input type="date" aria-label="Filter to date" /></label>
        <span className="filter-awaiting">Filters ready · no data</span>
      </div>
      <div className="map-workspace-grid">
        <section className="panel main-map-panel"><div className="panel-heading"><div><h2>Regional map</h2><p>Pan and zoom to explore. No study area or hotspot observations are configured.</p></div><StatusBadge>Navigation only</StatusBadge></div><MapCanvas emptyMessage={search || severity !== "all" ? "No matching hotspot data" : "No hotspot observations available"} /></section>
        <aside className="panel hotspot-details"><div className="panel-heading"><div><h2>Hotspot details</h2><p>Selected location</p></div><span className="panel-icon"><MapPin size={17} /></span></div><div className="selected-location-empty"><div className="location-target"><MapPin size={23} /></div><strong>No location selected</strong><p>Connect observations to explore severity, measured volume, and prediction status by location.</p></div><div className="detail-list"><DetailRow label="Location" value="Awaiting data" /><DetailRow label="Observed volume" value="— kg" /><DetailRow label="Observation date" value="—" /><DetailRow label="Severity" value="Not available" /></div><div className="severity-legend"><strong>Severity legend</strong><div><span className="severity-dot severity-low" />Low accumulation</div><div><span className="severity-dot severity-medium" />Medium accumulation</div><div><span className="severity-dot severity-high" />High accumulation</div><p>Severity is not currently calculated or shown.</p></div></aside>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div>;
}

function WasteRecordsPage({ notify }: PageProps) {
  const [observations, setObservations] = useState<WasteObservation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const filtered = useMemo(() => observations.filter((item) => {
    const matchesSearch = item.locationName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    const matchesStatus = status === "all" || item.collectionStatus === status;
    const day = item.observedAt.slice(0, 10);
    return matchesSearch && matchesCategory && matchesStatus && (!fromDate || day >= fromDate) && (!toDate || day <= toDate);
  }), [observations, search, category, status, fromDate, toDate]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function addObservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const latitudeValue = String(form.get("latitude") ?? "").trim();
    const longitudeValue = String(form.get("longitude") ?? "").trim();
    const quantity = Number(form.get("quantity"));
    const latitude = latitudeValue === "" ? undefined : Number(latitudeValue);
    const longitude = longitudeValue === "" ? undefined : Number(longitudeValue);
    if (!Number.isFinite(quantity) || quantity < 0 ||
      (latitude !== undefined && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
      (longitude !== undefined && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))) {
      notify({ title: "Check observation values", detail: "Quantity must be non-negative and optional coordinates must be valid decimal degrees." });
      return;
    }
    const observation: WasteObservation = {
      id: crypto.randomUUID(),
      locationName: String(form.get("location") ?? "").trim(),
      latitude,
      longitude,
      observedAt: String(form.get("observedAt")),
      category: String(form.get("category")) as WasteCategory,
      quantityKg: quantity,
      collectionStatus: String(form.get("status")) as CollectionStatus,
      notes: String(form.get("notes") ?? "").trim() || undefined,
      source: "session-only",
    };
    setObservations((current) => [observation, ...current]);
    setPage(0);
    setModalOpen(false);
    event.currentTarget.reset();
    notify({ title: "Added to this session", detail: "This frontend-only observation is temporary and is not saved to a database." });
  }

  return (
    <>
      <PageHeading eyebrow="DATA MANAGEMENT" title="Waste records" description="Review and prepare observation records for a future connected data workflow." actions={<button className="button button-primary" onClick={() => setModalOpen(true)}><Plus size={17} /> Add observation</button>} />
      <div className="notice-strip"><ShieldCheck size={17} /><span><strong>Temporary frontend session</strong> · Entries added here exist only until this page is refreshed. No database is connected.</span></div>
      <section className="panel records-panel">
        <div className="records-toolbar">
          <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search location" aria-label="Search by location" /></label>
          <label className="select-field"><span>Category</span><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
          <label className="select-field"><span>Status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="all">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
          <label className="date-filter"><CalendarDays size={15} /><input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(0); }} aria-label="Observation date from" /></label>
          <label className="date-filter"><span>to</span><input type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(0); }} aria-label="Observation date to" /></label>
        </div>
        {visible.length === 0 ? <EmptyState icon={FileText} title={observations.length === 0 ? "No waste records yet" : "No records match these filters"} detail={observations.length === 0 ? "Verified records will appear here after dataset integration. You can add a temporary session entry to explore the form." : "Try adjusting your search or filters to see available session entries."} action={observations.length === 0 && <button className="button button-outline" onClick={() => setModalOpen(true)}><Plus size={15} /> Add session entry</button>} /> :
          <div className="table-scroll"><table className="records-table"><thead><tr><th>Location</th><th>Observed</th><th>Category</th><th>Quantity</th><th>Status</th><th>Source</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id}><td><strong>{row.locationName}</strong><small>{row.latitude !== undefined && row.longitude !== undefined ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}` : "Coordinates not provided"}</small></td><td>{new Date(row.observedAt).toLocaleString()}</td><td><span className="category-chip">{row.category}</span></td><td><strong>{row.quantityKg.toLocaleString()} kg</strong></td><td><StatusBadge tone={row.collectionStatus === "Collected" ? "green" : row.collectionStatus === "Pending" ? "amber" : "neutral"}>{row.collectionStatus}</StatusBadge></td><td><span className="session-tag">This session</span></td></tr>)}</tbody></table></div>}
        <div className="table-footer"><span>{filtered.length ? `Showing ${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filtered.length)} of ${filtered.length} session entries` : "0 records"}</span><div className="pagination"><button aria-label="Previous page" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft size={16} /></button><span>Page {page + 1} of {pageCount}</span><button aria-label="Next page" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}><ChevronRight size={16} /></button></div></div>
      </section>
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="observation-title"><div className="modal-heading"><div><p className="eyebrow">SESSION-ONLY ENTRY</p><h2 id="observation-title">Add waste observation</h2></div><button className="icon-button" aria-label="Close form" onClick={() => setModalOpen(false)}><X size={19} /></button></div><p className="modal-intro">This record is kept in temporary page state only. It will not be sent to a server or retained after refresh.</p><form className="observation-form" onSubmit={addObservation}>
        <label className="form-field form-full">Location name<input name="location" required maxLength={120} placeholder="e.g. Community collection point" /></label>
        <label className="form-field">Latitude <span className="optional">(optional)</span><input name="latitude" type="number" step="any" min="-90" max="90" placeholder="Decimal degrees" /></label>
        <label className="form-field">Longitude <span className="optional">(optional)</span><input name="longitude" type="number" step="any" min="-180" max="180" placeholder="Decimal degrees" /></label>
        <label className="form-field">Observation date & time<input name="observedAt" required type="datetime-local" defaultValue={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} /></label>
        <label className="form-field">Waste category<select name="category" required>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="form-field">Quantity (kg)<input name="quantity" required type="number" min="0" step="0.01" placeholder="Measured or estimated" /></label>
        <label className="form-field">Collection status<select name="status" required>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="form-field form-full">Notes <span className="optional">(optional)</span><textarea name="notes" maxLength={500} rows={3} placeholder="Source or measurement context; avoid personal information." /></label>
        <div className="form-actions"><button type="button" className="button button-outline" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="button button-primary"><Check size={16} /> Add to this session</button></div>
      </form></section></div>}
    </>
  );
}

function ForecastingPage({ notify }: PageProps) {
  const [horizon, setHorizon] = useState("7");
  return (
    <>
      <PageHeading eyebrow="AI INTELLIGENCE" title="Forecasting & hotspots" description="A future forecasting workspace for responsible, data-backed waste demand insights." actions={<StatusBadge tone="amber">Model not connected</StatusBadge>} />
      <div className="integration-alert"><span className="alert-icon"><Sparkles size={18} /></span><div><strong>Forecasting is not yet available.</strong><p>Connect the dataset and train or configure a forecasting model before generating predictions.</p></div></div>
      <div className="forecast-controls panel"><div className="control-heading"><div><h2>Forecast configuration</h2><p>Controls are prepared for a future model integration.</p></div><Settings2 size={18} /></div><div className="controls-grid"><label className="form-field">Location<select disabled defaultValue=""><option value="">No locations available</option></select></label><label className="form-field">Forecast horizon<select value={horizon} onChange={(event) => setHorizon(event.target.value)}><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><label className="form-field">Start date<input type="date" disabled /></label><label className="form-field">End date<input type="date" disabled /></label><button className="button button-primary generate-button" onClick={() => notify({ title: "Forecast not generated", detail: "Connect a dataset and forecasting model before requesting a prediction." })}><Sparkles size={16} /> Generate forecast</button></div></div>
      <div className="dashboard-grid forecast-panels"><section className="panel"><div className="panel-heading"><div><h2>Forecast outlook</h2><p>Observed and predicted values by timestamp</p></div><span className="panel-icon"><Activity size={17} /></span></div><div className="large-chart-placeholder"><div className="chart-grid-lines"><i /><i /><i /><i /></div><EmptyState icon={BarChart3} title="No forecast data available" detail={`A ${horizon}-day forecast chart will appear here after the forecasting service is configured.`} /></div></section><section className="panel growth-panel"><div className="panel-heading"><div><h2>Hotspot growth</h2><p>Location-level change over the selected horizon</p></div><span className="panel-icon"><ArrowDownRight size={17} /></span></div><EmptyState icon={MapPin} title="No hotspot growth to display" detail="Hotspot growth requires historical observations and an evaluated forecasting model." /></section></div>
      <div className="model-info-grid"><InfoCard icon={Database} title="Dataset" status="Not connected" detail="Data quality, coverage, and feature availability are not yet assessed." /><InfoCard icon={Sparkles} title="Forecasting model" status="Not configured" detail="Algorithm selection should follow inspection of the real dataset." /><InfoCard icon={Activity} title="Uncertainty estimates" status="Not available" detail="Prediction intervals will only be shown if supported by the selected model." /></div>
    </>
  );
}

function InfoCard({ icon: Icon, title, status, detail }: { icon: typeof Database; title: string; status: string; detail: string }) {
  return <section className="panel info-card"><span className="info-card-icon"><Icon size={17} /></span><p className="info-label">{title}</p><strong>{status}</strong><p>{detail}</p></section>;
}

function PlanningPage({ notify }: PageProps) {
  const [capacity, setCapacity] = useState("5000");
  const [shift, setShift] = useState("8");
  const [objective, setObjective] = useState("distance");
  return (
    <>
      <PageHeading eyebrow="OPERATIONS" title="Collection planning" description="Prepare vehicle, shift, and optimization constraints for future route planning." actions={<StatusBadge>Optimization unavailable</StatusBadge>} />
      <div className="integration-alert"><span className="alert-icon"><Route size={18} /></span><div><strong>Route optimization is not connected.</strong><p>Real collection points, road-network information, and a route-optimization service are required.</p></div></div>
      <div className="planning-layout">
        <div className="planning-main"><section className="panel main-map-panel"><div className="panel-heading"><div><h2>Planning map</h2><p>Collection locations and road routes will appear when connected.</p></div><span className="panel-icon"><Map size={17} /></span></div><MapCanvas emptyMessage="No collection points available" /></section>
          <section className="panel stops-panel"><div className="panel-heading"><div><h2>Collection points</h2><p>Stops will be sourced from verified waste records.</p></div><span className="count-pill">0 stops</span></div><EmptyState icon={MapPin} title="No collection points added" detail="Add verified locations through the data integration before planning a route." /></section></div>
        <aside className="planning-side"><section className="panel settings-panel"><div className="panel-heading"><div><h2>Planning settings</h2><p>Configure future optimization constraints.</p></div><Settings2 size={18} /></div><label className="form-field">Vehicle capacity (kg)<input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label><label className="form-field">Shift duration (hours)<input type="number" min="1" max="24" value={shift} onChange={(event) => setShift(event.target.value)} /></label><label className="form-field">Optimization objective<select value={objective} onChange={(event) => setObjective(event.target.value)}><option value="distance">Minimize distance</option><option value="time">Minimize time</option><option value="cost">Minimize operational cost</option></select></label><label className="form-field">Collection priority<select defaultValue="balanced"><option value="balanced">Balanced</option><option value="urgent">Urgent first</option><option value="volume">Highest volume first</option></select></label><div className="setting-divider" /><label className="form-field">Vehicle / team<select disabled defaultValue=""><option value="">No vehicles configured</option></select></label><button className="button button-primary full-button" onClick={() => notify({ title: "Routes not optimized", detail: "Connect real collection points, road-network data, and a route-optimization service before calculating routes." })}><Sparkles size={16} /> Optimize collection routes</button><p className="settings-note"><ShieldCheck size={14} /> No route or distance will be estimated without connected data.</p></section>
          <section className="panel results-panel"><div className="panel-heading"><div><h2>Optimization results</h2><p>Awaiting an optimization service</p></div></div><div className="result-placeholder"><Route size={19} /><span>Route results will appear here</span></div><div className="result-metrics"><DetailRow label="Estimated distance" value="— km" /><DetailRow label="Estimated duration" value="—" /><DetailRow label="Vehicle utilization" value="—" /><DetailRow label="Service coverage" value="—" /></div></section></aside>
      </div>
    </>
  );
}

function ReportsPage({ notify }: PageProps) {
  const sections = [
    { title: "Waste volume trends", detail: "Historical observations by date and location", icon: BarChart3 },
    { title: "Hotspot distribution", detail: "Observed hotspot patterns and severity", icon: MapPin },
    { title: "Forecast performance", detail: "Model evaluation on verified holdout data", icon: Activity },
    { title: "Collection efficiency", detail: "Recorded service and collection outcomes", icon: Truck },
    { title: "Route optimization", detail: "Measured route distance, duration, and costs", icon: Route },
    { title: "Service coverage", detail: "Coverage based on configured operational data", icon: LocateFixed },
  ];
  return (
    <>
      <PageHeading eyebrow="INSIGHTS" title="Reports & analytics" description="A reporting workspace prepared for verified operational and model outputs." actions={<button className="button button-outline" disabled title="Reports require connected records and model outputs"><Download size={16} /> Export report</button>} />
      <div className="filters-toolbar report-filters"><label className="date-filter"><CalendarDays size={15} /><input type="date" aria-label="Report start date" /></label><span className="date-to">to</span><label className="date-filter"><input type="date" aria-label="Report end date" /></label><label className="select-field"><span>Location</span><select disabled defaultValue=""><option value="">No locations available</option></select><ChevronDown size={14} /></label><StatusBadge>Awaiting data</StatusBadge></div>
      <div className="report-grid">{sections.map(({ title, detail, icon: Icon }) => <section key={title} className="panel report-card"><div className="report-card-heading"><span className="panel-icon"><Icon size={17} /></span><StatusBadge>Awaiting data</StatusBadge></div><h2>{title}</h2><p>{detail}</p><div className="report-chart-empty"><BarChart3 size={20} /><span>No connected data</span></div><small>Visualization will be available after integration.</small></section>)}</div>
      <div className="report-footer-note"><FileText size={17} /><span><strong>Reports are not yet available.</strong> Connect real records and validated model outputs before viewing or exporting analytics. No metrics or comparisons are estimated.</span><button className="text-link" onClick={() => notify({ title: "No report exported", detail: "A report can be generated after verified records or model outputs are connected." })}>Why is export disabled? <ArrowRight size={14} /></button></div>
    </>
  );
}

const setupStages = [
  "Obtain and inspect a credible waste-management dataset.",
  "Validate data quality, locations, timestamps, units, and missing values.",
  "Build and test the data preprocessing pipeline.",
  "Train and evaluate a suitable forecasting model.",
  "Implement and evaluate route optimization.",
  "Connect the backend API to the frontend.",
  "Validate the end-to-end system with real data.",
  "Deploy and document the application.",
];

function SetupPage({ notify }: PageProps) {
  const [copied, setCopied] = useState(false);
  async function copyConfig() {
    try {
      await navigator.clipboard.writeText("VITE_API_BASE_URL=");
      setCopied(true);
      notify({ title: "Configuration copied", detail: "The environment variable placeholder was copied to your clipboard." });
    } catch (error) {
      if (error instanceof Error) {
        notify({ title: "Clipboard unavailable", detail: "Copy the VITE_API_BASE_URL setting manually from the configuration panel." });
        return;
      }
      throw error;
    }
  }
  return (
    <>
      <PageHeading eyebrow="PROJECT CONFIGURATION" title="System setup" description="A transparent roadmap from dataset preparation to a validated end-to-end application." actions={<StatusBadge tone="green">Frontend ready</StatusBadge>} />
      <div className="setup-readiness"><div className="readiness-icon"><Check size={18} /></div><div><strong>Frontend application is ready</strong><p>Navigation, empty states, typed integration points, and session-only form interactions are implemented.</p></div><span className="readiness-divider" /><div className="readiness-icon pending"><Clock3 size={18} /></div><div><strong>Data & AI integration pending</strong><p>No dataset, API, model, route engine, or operational results are connected.</p></div></div>
      <section className="panel setup-checklist"><div className="panel-heading"><div><h2>Integration checklist</h2><p>Stages to complete before using the system for operational decisions.</p></div><span className="checklist-count">0 of 8 complete</span></div><ol>{setupStages.map((stage, index) => <li key={stage}><span className={`stage-number${index === 5 ? " stage-current" : ""}`}>{index + 1}</span><span>{stage}</span><StatusBadge tone={index === 5 ? "green" : "amber"}>{index === 5 ? "Frontend integration point ready" : "Pending"}</StatusBadge></li>)}</ol></section>
      <div className="setup-bottom-grid"><section className="panel architecture-panel"><div className="panel-heading"><div><h2>Planned system architecture</h2><p>Integration boundaries, not active services</p></div><span className="panel-icon"><Layers3 size={17} /></span></div><div className="architecture-flow">{[{ icon: Database, label: "Dataset" }, { icon: Settings2, label: "Preprocessing" }, { icon: Sparkles, label: "Forecast model" }, { icon: Route, label: "Route engine" }, { icon: Cloud, label: "Backend API" }, { icon: Leaf, label: "WasteWise AI" }].map(({ icon: Icon, label }, index, list) => <div className="architecture-step" key={label}><div className={`architecture-node${index === list.length - 1 ? " node-ready" : ""}`}><Icon size={18} /></div><span>{label}</span>{index < list.length - 1 && <ArrowRight className="architecture-arrow" size={15} />}</div>)}</div><div className="architecture-legend"><span><i className="legend-ready" /> Frontend implemented</span><span><i className="legend-pending" /> Planned integration</span></div></section>
        <section className="panel config-panel"><div className="panel-heading"><div><h2>Environment configuration</h2><p>Set a real API URL when the backend is available.</p></div><span className="panel-icon"><Settings2 size={17} /></span></div><label htmlFor="api-url">API base URL</label><div className="config-code"><code>VITE_API_BASE_URL=</code><span>Not configured</span></div><p>Place this setting in a local <code>.env</code> file. Do not commit credentials or secrets. The app works without it.</p><button className="button button-outline" onClick={copyConfig}><FileText size={15} /> {copied ? "Copied" : "Copy configuration key"}</button></section>
      </div>
      <div className="research-note"><ShieldCheck size={18} /><div><strong>Research integrity by design</strong><p>Waste observations, predictions, model accuracy, route distances, savings, and environmental impacts are never fabricated. Document source, measurement method, limitations, and known biases when real data becomes available.</p></div></div>
    </>
  );
}

function NotFoundPage() {
  return <div className="not-found panel"><div className="empty-icon"><Search size={21} /></div><h1>Page not found</h1><p>The page you requested does not exist.</p><Link className="button button-primary" to="/">Return to overview <ArrowRight size={15} /></Link></div>;
}

export default App;
