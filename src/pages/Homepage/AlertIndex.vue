<template>
    <div class="w-full px-40 py-6 mt-20 bg-white">
        <div class="max-w-7xl mx-auto space-y-20">
            <div class="text-center space-y-6 mb-8">
                <h1 class="text-green-600 text-5xl font-extrabold text-center uppercase">
                    TOUTES LES ALERTES
                </h1>

                <p class="text-green-600 text-lg font-normal mx-auto text-center mt-4">
                    RETROUVEZ ICI L'ENSEMBLE DES ANNONCES D'ANIMAUX PERDUS ET RETROUVÉS.
                </p>
            </div>

            <!-- Filters -->
            <div class="flex gap-4 mb-8 flex-wrap">
                <button @click="setFilter('all')" :class="[
                    'flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition',
                    filter === 'all'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
                ]">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                        <path fill-rule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6zM9 13a1 1 0 100-2 1 1 0 000 2z"
                            clip-rule="evenodd" />
                    </svg>
                    Tous les animaux
                </button>

                <button @click="setFilter('active')" :class="[
                    'flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition',
                    filter === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
                ]">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    Animaux perdus
                </button>

                <button @click="setFilter('found')" :class="[
                    'flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition',
                    filter === 'found'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
                ]">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    Animaux retrouvés
                </button>
            </div>

            <!-- Alerts List -->
            <div class="space-y-6">
                <div v-for="alert in filteredAlerts" :key="alert.id"
                    class="bg-white rounded-2xl border-4 border-black p-6 hover:shadow-lg transition">
                    <div class="flex gap-6">
                        <!-- Content -->
                        <div class="flex-1">
                            <h2 class="text-xl font-bold text-black mb-4">{{ alert.name }} – {{ alert.breed }}</h2>

                            <div class="space-y-2 text-sm">
                                <div class="flex items-start gap-2">
                                    <span class="font-semibold text-green-600 min-w-fit">Où ?</span>
                                    <span class="text-gray-700">Vu pour la dernière fois à {{ alert.location }}</span>
                                </div>

                                <div class="flex items-start gap-2">
                                    <span class="font-semibold text-green-600 min-w-fit">Quand ?</span>
                                    <span class="text-gray-700">{{ formatDate(alert.dateTime) }}</span>
                                </div>

                                <div class="flex items-start gap-2">
                                    <span class="font-semibold text-green-600 min-w-fit">Particularités :</span>
                                    <span class="text-gray-700">{{ alert.description }}</span>
                                </div>
                            </div>

                            <!-- Status Badge -->
                            <div class="mt-4 inline-block">
                                <span v-if="alert.status === 'active'"
                                    class="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                    Encore perdu
                                </span>
                                <span v-else-if="alert.status === 'found'"
                                    class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    <span class="w-2 h-2 bg-green-600 rounded-full"></span>
                                    Retrouvé
                                </span>
                            </div>
                        </div>

                        <!-- Image -->
                        <div class="flex-shrink-0">
                            <img :src="alert.photo" :alt="alert.name"
                                class="w-40 h-40 object-cover rounded-lg border-2 border-gray-300" />
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-4 mt-6">
                        <button @click="markAsFound(alert.id)" v-if="alert.status === 'active'"
                            class="flex-1 bg-primary-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition">
                            J'AI TROUVÉ CET ANIMAL
                        </button>
                        <button v-else disabled
                            class="flex-1 bg-gray-400 text-white font-bold py-2 px-6 rounded-full cursor-not-allowed">
                            RETROUVÉ
                        </button>

                        <button @click="shareAlert(alert)"
                            class="flex-1 bg-primary-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-6 rounded-full transition">
                            PARTAGER L'ANNONCE
                        </button>
                    </div>
                    <p class="text-xs text-gray-600 text-center mt-2">Ce bouton laisse directement appel au numéro du
                        propriétaire</p>
                </div>

                <!-- Empty State -->
                <div v-if="filteredAlerts.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-gray-600 text-lg font-semibold">Aucune annonce pour ce filtre</p>
                    <p class="text-gray-500 text-sm mt-2">Essayez un autre filtre ou revenir plus tard</p>
                </div>
            </div>
        </div>

        <!-- Share Modal -->
        <div v-if="showShareModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold text-gray-800">Partager l'annonce</h3>
                    <button @click="showShareModal = false" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="space-y-3">
                    <button @click="shareVia('facebook')"
                        class="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M8.29 20v-7.21H5.5V9.25h2.79V7.07c0-2.77 1.69-4.28 4.16-4.28 1.18 0 2.2.09 2.5.13v2.9h-1.72c-1.35 0-1.61.64-1.61 1.58v2.07h3.21l-.41 3.54h-2.8V20" />
                        </svg>
                        Facebook
                    </button>

                    <button @click="shareVia('twitter')"
                        class="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-400 hover:bg-blue-500 text-white rounded-lg font-semibold transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.029 3.75 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                        Twitter
                    </button>

                    <button @click="shareVia('whatsapp')"
                        class="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18.5c-4.688 0-8.5-3.812-8.5-8.5S5.312 1.5 10 1.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z" />
                        </svg>
                        WhatsApp
                    </button>

                    <button @click="copyLink"
                        class="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        {{ linkCopied ? 'Copié !' : 'Copier le lien' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AlertPage',
    data() {
        return {
            filter: 'all',
            showShareModal: false,
            selectedAlert: null,
            linkCopied: false,
            alerts: [
                {
                    id: 1,
                    name: 'ODESSA',
                    breed: 'GOLDEN RETRIEVER',
                    location: 'Villeurbanne',
                    dateTime: '2025-11-20T18:30',
                    description: 'porté un collier rouge',
                    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
                    status: 'active',
                    contact: '06 12 34 56 78',
                },
                {
                    id: 2,
                    name: 'LUNA',
                    breed: 'CHAT NOIR',
                    location: 'Lyon 3ème',
                    dateTime: '2025-10-15T14:20',
                    description: 'collier rose avec clochette',
                    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
                    status: 'found',
                    contact: '06 98 76 54 32',
                },
                {
                    id: 3,
                    name: 'MAX',
                    breed: 'BERGER ALLEMAND',
                    location: 'Villeurbanne',
                    dateTime: '2025-11-18T10:00',
                    description: 'tache blanche sur le front',
                    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
                    status: 'active',
                    contact: '06 45 67 89 01',
                },
                {
                    id: 4,
                    name: 'FLUFFY',
                    breed: 'GOLDEN RETRIEVER',
                    location: 'Décines',
                    dateTime: '2025-10-10T09:15',
                    description: 'sans collier',
                    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
                    status: 'found',
                    contact: '06 11 22 33 44',
                },
            ],
        };
    },
    computed: {
        filteredAlerts() {
            if (this.filter === 'active') {
                return this.alerts.filter(alert => alert.status === 'active');
            } else if (this.filter === 'found') {
                return this.alerts.filter(alert => alert.status === 'found');
            }
            return this.alerts;
        },
    },
    methods: {
        setFilter(newFilter) {
            this.filter = newFilter;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
        markAsFound(alertId) {
            const alert = this.alerts.find(a => a.id === alertId);
            if (alert) {
                alert.status = 'found';
                this.$forceUpdate();
            }
        },
        shareAlert(alert) {
            this.selectedAlert = alert;
            this.showShareModal = true;
        },
        shareVia(platform) {
            if (!this.selectedAlert) return;

            const title = `Animal retrouvé: ${this.selectedAlert.name}`;
            const url = window.location.href;

            const shareUrls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            };

            if (shareUrls[platform]) {
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            }
        },
        copyLink() {
            if (!this.selectedAlert) return;

            const link = `${window.location.origin}/alert/${this.selectedAlert.id}`;
            navigator.clipboard.writeText(link);
            this.linkCopied = true;
            setTimeout(() => {
                this.linkCopied = false;
            }, 2000);
        },
    },
};
</script>