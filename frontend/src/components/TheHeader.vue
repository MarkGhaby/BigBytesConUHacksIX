<template>
    <q-header>
        <q-toolbar>
        <q-btn
            flat
            dense
            round
            icon="menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
        />
    
        <q-toolbar-title>
            Quasar App
        </q-toolbar-title>
    
        <div>Quasar v{{ $q.version }}</div>
        </q-toolbar>
    </q-header>
    
    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
    >
        <q-list>
        <q-item-label
            header
        >
            Essential Links
        </q-item-label>
    
        <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
        />
        </q-list>
    </q-drawer>
    
    <q-page-container>
        <router-view />
    </q-page-container>
</template>
<script>
</script>