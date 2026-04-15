/**
 * RideKidz - Uber Inspired Logic (Human Developed)
 * Focus: Reliability, Speed, and Confident Transitions.
 */

const app = {
    state: {
        currentScreen: 'splash',
        tripType: 'morning',
        isSheetExpanded: false,
        isDriverSheetExpanded: false,
        halfwayAlertTriggered: false,
        boardingAlertTriggered: false,
        
        // Maps & Layers
        map: null,
        driverMap: null,
        driverMarker: null,
        routeLayer: null,
        stopMarkers: [],
        driverStopMarkers: [],
        animFrame: null
    },

    router: {
        go(screenId) {
            console.log(`Navigating to ${screenId}`);
            
            // Cleanup
            if (app.state.currentScreen === 'tracking') app.tracking.cleanup();
            
            // Switch Screens
            document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
            const target = document.getElementById(`screen-${screenId}`);
            if (target) {
                target.classList.remove('hidden');
                app.state.currentScreen = screenId;
                
                // Init Screen Logic
                if (screenId === 'tracking') setTimeout(() => app.tracking.init(), 100);
                else if (screenId === 'driver') setTimeout(() => app.driver.init(), 100);
            }
        }
    },

    registration: {
        currentStep: 1,
        nextStep() {
            if (this.currentStep < 3) {
                document.getElementById(`reg-step-${this.currentStep}`).classList.add('hidden');
                this.currentStep++;
                document.getElementById(`reg-step-${this.currentStep}`).classList.remove('hidden');
                this.updateStepDots();
            }
        },
        prevStep() {
            if (this.currentStep > 1) {
                document.getElementById(`reg-step-${this.currentStep}`).classList.add('hidden');
                this.currentStep--;
                document.getElementById(`reg-step-${this.currentStep}`).classList.remove('hidden');
                this.updateStepDots();
            }
        },
        updateStepDots() {
            document.querySelectorAll('.step-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i < this.currentStep);
            });
        }
    },

    tracking: {
        data: {
            morning: [
                { name: 'Start', latlng: [-26.105, 28.050], type: 'depot', status: 'passed' },
                { name: 'Kamo M.', latlng: [-26.108, 28.055], type: 'pickup', status: 'picked_up', address: '12 Oak Lane' },
                { name: 'Zara Nkosi', latlng: [-26.112, 28.062], type: 'pickup', status: 'upcoming', address: '45 Elm Avenue' },
                { name: 'Lebo S.', latlng: [-26.115, 28.068], type: 'pickup', status: 'upcoming', address: '88 Rose St' },
                { name: 'School', latlng: [-26.120, 28.075], type: 'school', status: 'upcoming', address: 'Greenfield Primary' }
            ],
            afternoon: [
                { name: 'School', latlng: [-26.120, 28.075], type: 'school', status: 'passed' },
                { name: 'Zara Nkosi', latlng: [-26.112, 28.062], type: 'pickup', status: 'upcoming' },
                { name: 'End', latlng: [-26.105, 28.050], type: 'depot', status: 'upcoming' }
            ]
        },

        init() {
            console.log("Initializing Parent Map...");
            const firstStop = this.data.morning[0].latlng;

            if (!app.state.map) {
                app.state.map = L.map('map-container', {
                    zoomControl: false,
                    attributionControl: false
                }).setView(firstStop, 14);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(app.state.map);
            }

            this.renderTrip();
            this.startAnimation();
        },

        renderTrip() {
            const stops = this.data[app.state.tripType];
            const latlngs = stops.map(s => s.latlng);

            // Route Polyline
            if (app.state.routeLayer) app.state.map.removeLayer(app.state.routeLayer);
            app.state.routeLayer = L.polyline(latlngs, {
                color: '#000',
                weight: 4,
                opacity: 0.6,
                dashArray: '8, 12'
            }).addTo(app.state.map);

            // Markers
            app.state.stopMarkers.forEach(m => app.state.map.removeLayer(m));
            app.state.stopMarkers = [];

            stops.forEach(s => {
                const icon = L.divIcon({
                    className: 'map-stop-icon',
                    html: `<div style="width: 12px; height: 12px; background: ${s.status === 'passed' || s.status === 'picked_up' ? '#000' : '#fff'}; border: 3px solid #000; border-radius: 50%;"></div>`,
                    iconSize: [12, 12]
                });
                const m = L.marker(s.latlng, { icon }).addTo(app.state.map);
                app.state.stopMarkers.push(m);
            });

            // Driver Marker
            if (app.state.driverMarker) app.state.map.removeLayer(app.state.driverMarker);
            const driverIcon = L.divIcon({
                className: 'van-icon',
                html: `<div style="width: 36px; height: 36px; background: #000; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 3px solid #fff;">
                        <i class="ph-fill ph-bus"></i>
                       </div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });
            app.state.driverMarker = L.marker(latlngs[0], { icon: driverIcon, zIndexOffset: 1000 }).addTo(app.state.map);

            app.state.map.fitBounds(latlngs, { padding: [120, 120] });
            this.renderStopsList();
        },

        renderStopsList() {
            const container = document.getElementById('stops-list');
            const stops = this.data[app.state.tripType];
            
            container.innerHTML = stops.map(s => `
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                    <div style="display: flex; flex-direction: column; align-items: center; width: 24px;">
                        <div style="width: 10px; height: 10px; border-radius: 50%; background: ${s.status === 'passed' || s.status === 'picked_up' ? '#000' : '#eee'}; border: 2px solid #000;"></div>
                        <div style="width: 2px; height: 30px; background: #eee;"></div>
                    </div>
                    <div style="flex: 1;">
                        <p style="font-weight: 700; color: #000;">${s.name}</p>
                        <p style="font-size: 13px; color: #999;">${s.address || 'Scholars Hub'}</p>
                    </div>
                    <span style="font-size: 12px; font-weight: 800; color: ${s.status === 'picked_up' ? 'var(--green)' : '#999'};">
                        ${s.status === 'picked_up' ? 'Picked Up' : '07:22'}
                    </span>
                </div>
            `).join('');
        },

        startAnimation() {
            const stops = this.data[app.state.tripType];
            const startTime = performance.now();
            const duration = 40000; // 40 seconds trip cycle

            const animate = (now) => {
                const t = ((now - startTime) % duration) / duration;
                
                // Linear interpolation across segments
                const segments = stops.length - 1;
                const totalT = t * segments;
                const currentIndex = Math.floor(totalT);
                const nextIndex = (currentIndex + 1) % stops.length;
                const segmentT = totalT - currentIndex;

                const start = stops[currentIndex].latlng;
                const end = stops[nextIndex].latlng;

                const curLat = start[0] + (end[0] - start[0]) * segmentT;
                const curLng = start[1] + (end[1] - start[1]) * segmentT;

                if (app.state.driverMarker) {
                    app.state.driverMarker.setLatLng([curLat, curLng]);
                }

                // --- LIVE ALERTS ---
                if (totalT > 1.5 && !app.state.halfwayAlertTriggered) {
                    this.showNotification("Driver is 1 stop away", "ph-van-taxi");
                    app.state.halfwayAlertTriggered = true;
                    document.getElementById('status-text').innerText = "Arriving in 2 mins";
                }

                if (currentIndex === 2 && segmentT > 0.1 && !app.state.boardingAlertTriggered) {
                    this.updateScanStatus(true);
                    this.showNotification("Zara has safely boarded", "ph-user-focus");
                    app.state.boardingAlertTriggered = true;
                }

                if (t > 0.95 && app.state.currentScreen === 'tracking') {
                    document.getElementById('summary-modal').classList.remove('hidden');
                }

                if (t < 0.05) {
                    app.state.halfwayAlertTriggered = false;
                    app.state.boardingAlertTriggered = false;
                    this.updateScanStatus(false);
                    document.getElementById('status-text').innerText = "Driver is starting route";
                }

                app.state.animFrame = requestAnimationFrame(animate);
            };

            app.state.animFrame = requestAnimationFrame(animate);
        },

        showNotification(text, iconClass) {
            const container = document.getElementById('notification-container');
            const notif = document.createElement('div');
            notif.className = 'floating-card animate-slide-up';
            notif.style.marginTop = '12px';
            notif.style.pointerEvents = 'auto';
            notif.innerHTML = `
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="background: var(--black); color: white; padding: 10px; border-radius: 50%;">
                        <i class="ph-fill ${iconClass}"></i>
                    </div>
                    <div>
                        <p style="font-weight: 800; font-size: 14px;">${text}</p>
                        <p style="font-size: 11px; color: #999; font-weight: 500;">Just now • Security Alert</p>
                    </div>
                </div>
            `;
            container.appendChild(notif);
            setTimeout(() => {
                notif.style.opacity = '0';
                notif.style.transform = 'translateY(-20px)';
                setTimeout(() => notif.remove(), 500);
            }, 5000);
        },

        updateScanStatus(isOnboard) {
            const badge = document.getElementById('scan-status-badge');
            const icon = document.getElementById('scan-check-icon');
            if (isOnboard) {
                badge.className = 'status-badge';
                badge.style.background = '#ecfdf5';
                badge.style.color = '#059669';
                badge.innerHTML = '<i class="ph-fill ph-check-circle"></i> Onboarded';
                icon.className = 'ph-fill ph-seal-check';
                icon.style.color = 'var(--green)';
            } else {
                badge.className = 'status-badge';
                badge.style.background = '#fbf2e9';
                badge.style.color = '#9a3412';
                badge.innerHTML = '<i class="ph-fill ph-clock"></i> Waiting for Pickup';
                icon.className = 'ph-fill ph-seal-warning';
                icon.style.color = '#f59e0b';
            }
        },

        toggleSheet() {
            const sheet = document.getElementById('bottom-sheet');
            app.state.isSheetExpanded = !app.state.isSheetExpanded;
            sheet.style.transform = app.state.isSheetExpanded ? 'translateY(0)' : 'translateY(calc(100% - 140px))';
        },

        toggleStops() {
            const list = document.getElementById('stops-list');
            const arrow = document.getElementById('stops-arrow');
            list.classList.toggle('hidden-stops');
            arrow.classList.toggle('ph-caret-up');
            arrow.classList.toggle('ph-caret-down');
            if (!app.state.isSheetExpanded) this.toggleSheet();
        },

        toggleFab() {
            const menu = document.getElementById('fab-menu');
            const icon = document.getElementById('fab-icon');
            menu.classList.toggle('show');
            icon.classList.toggle('ph-plus');
            icon.classList.toggle('ph-x');
        },

        switchTrip(type) {
            app.state.tripType = type;
            document.getElementById('btn-am').classList.toggle('active', type === 'morning');
            document.getElementById('btn-pm').classList.toggle('active', type === 'afternoon');
            this.renderTrip();
        },

        cleanup() {
            if (app.state.animFrame) cancelAnimationFrame(app.state.animFrame);
        }
    },

    driver: {
        init() {
            console.log("Initializing Driver Flow...");
            this.initMap();
            this.renderRunSheet();
        },

        initMap() {
            if (!app.state.driverMap) {
                app.state.driverMap = L.map('driver-map-container', {
                    zoomControl: false,
                    attributionControl: false
                }).setView([-26.110, 28.060], 15);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(app.state.driverMap);
            }
            this.renderMarkers();
        },

        renderMarkers() {
            if (app.state.driverStopMarkers) {
                app.state.driverStopMarkers.forEach(m => app.state.driverMap.removeLayer(m));
            }
            app.state.driverStopMarkers = [];

            const stops = app.tracking.data[app.state.tripType];
            
            stops.forEach(s => {
                const icon = L.divIcon({
                    className: 'driver-stop-marker',
                    html: `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="background: white; color: #000; padding: 4px 10px; border-radius: 99px; font-size: 10px; font-weight: 800; margin-bottom: 4px; box-shadow: var(--shadow-floating); white-space: nowrap;">
                                ${s.name}
                            </div>
                            <div style="width: 20px; height: 20px; border-radius: 50%; background: ${s.status === 'picked_up' ? 'var(--green)' : 'white'}; border: 3px solid #000; box-shadow: var(--shadow-floating);"></div>
                        </div>
                    `,
                    iconSize: [60, 40],
                    iconAnchor: [30, 40]
                });
                const m = L.marker(s.latlng, { icon }).addTo(app.state.driverMap);
                app.state.driverStopMarkers.push(m);
            });

            app.state.driverMap.fitBounds(stops.map(s => s.latlng), { padding: [100, 100] });
        },

        renderRunSheet() {
            const container = document.getElementById('driver-run-list');
            const stops = app.tracking.data[app.state.tripType];
            
            container.innerHTML = stops.map(s => `
                <div class="card" style="padding: 16px; box-shadow: none; border: 1px solid #eee; display: flex; align-items: center; gap: 16px; opacity: ${s.status === 'picked_up' ? '0.5' : '1'};">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        <i class="ph-fill ${s.status === 'school' ? 'ph-graduation-cap' : 'ph-user'}"></i>
                    </div>
                    <div style="flex: 1;">
                        <p style="font-weight: 800; font-size: 15px;">${s.name}</p>
                        <p style="font-size: 12px; color: #999;">${s.address || 'Pickup Point'}</p>
                    </div>
                    <button class="btn ${s.status === 'picked_up' ? 'btn-outline' : 'btn-primary'}" style="padding: 8px 16px; font-size: 12px;" onclick="app.driver.toggleStudent('${s.name}')">
                        ${s.status === 'picked_up' ? 'Done' : 'Check-in'}
                    </button>
                </div>
            `).join('');
            
            this.updateStats();
        },

        updateStats() {
            const stops = app.tracking.data[app.state.tripType];
            const onboard = stops.filter(s => s.status === 'picked_up').length;
            document.getElementById('driver-stat-onboard').innerText = `${onboard}/${stops.length}`;
            document.getElementById('driver-stat-remaining').innerText = `${stops.length - onboard} Stops`;
            
            const next = stops.find(s => s.status === 'upcoming');
            if (next) {
                document.getElementById('nav-next-name').innerText = next.name;
                document.getElementById('nav-next-address').innerText = next.address;
            }
        },

        toggleStudent(name) {
            const student = app.tracking.data[app.state.tripType].find(s => s.name === name);
            if (student) {
                student.status = student.status === 'picked_up' ? 'upcoming' : 'picked_up';
                this.renderRunSheet();
                this.renderMarkers();
            }
        },

        toggleSheet() {
            const sheet = document.getElementById('driver-bottom-sheet');
            app.state.isDriverSheetExpanded = !app.state.isDriverSheetExpanded;
            sheet.style.transform = app.state.isDriverSheetExpanded ? 'translateY(0)' : 'translateY(calc(100% - 140px))';
        }
    }
};

// Start
app.router.go('splash');
