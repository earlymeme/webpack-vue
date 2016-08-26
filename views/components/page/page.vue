<template>
    <nav class="zpagenav">
        <span class="pagination page-link m-r-1">total:{{total}}</span>
        <ul class="pagination">
            <li @click="setPage(unit.page)" track-by="$index" v-for="unit in units" class="page-item {{unit.class}}"
                :disabled="unit.disabled">
                <a class="page-link" href="#p={{unit.page}}" aria-label="{{unit.ariaLabel}}">
                    <span v-if="unit.isPager" aria-hidden="true">{{{unit.html}}}</span>
                    <span v-else>{{{unit.html}}}</span>
                    <span v-if="unit.isPager" class="sr-only">{{{unit.srHtml}}}</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<style lang="sass">
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    .sr-only-focusable:active, .sr-only-focusable:focus {
        position: static;
        width: auto;
        height: auto;
        margin: 0;
        overflow: visible;
        clip: auto;
    }

    .m-r-1 {
        margin-right: 1rem !important;
    }

    .pagination {
        display: inline-block;
        padding-left: 0;
        margin-top: 1rem;
        margin-bottom: 1rem;
        border-radius: .25rem;
    }

    .page-item {
        display: inline;
    }

    .page-item:first-child .page-link {
        margin-left: 0;
        border-top-left-radius: .25rem;
        border-bottom-left-radius: .25rem;
    }

    .page-item:last-child .page-link {
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;
    }

    .page-item.active .page-link, .page-item.active .page-link:focus, .page-item.active .page-link:hover {
        z-index: 2;
        color: #fff;
        cursor: default;
        background-color: #0275d8;
        border-color: #0275d8;
    }

    .page-item.disabled .page-link, .page-item.disabled .page-link:focus, .page-item.disabled .page-link:hover {
        color: #818a91;
        cursor: not-allowed;
        background-color: #fff;
        border-color: #ddd;
    }

    .page-link {
        position: relative;
        float: left;
        padding: .5rem .75rem;
        margin-left: -1px;
        line-height: 1.5;
        color: #0275d8;
        text-decoration: none;
        background-color: #fff;
        border: 1px solid #ddd;
    }

    .page-link:focus, .page-link:hover {
        color: #014c8c;
        background-color: #eceeef;
        border-color: #ddd;
    }

    .pagination-lg .page-link {
        padding: .75rem 1.5rem;
        font-size: 1.25rem;
        line-height: 1.333333;
    }

    .pagination-lg .page-item:first-child .page-link {
        border-top-left-radius: .3rem;
        border-bottom-left-radius: .3rem;
    }

    .pagination-lg .page-item:last-child .page-link {
        border-top-right-radius: .3rem;
        border-bottom-right-radius: .3rem;
    }

    .pagination-sm .page-link {
        padding: .275rem .75rem;
        font-size: .875rem;
        line-height: 1.5;
    }

    .pagination-sm .page-item:first-child .page-link {
        border-top-left-radius: .2rem;
        border-bottom-left-radius: .2rem;
    }

    .pagination-sm .page-item:last-child .page-link {
        border-top-right-radius: .2rem;
        border-bottom-right-radius: .2rem;
    }

    .pager {
        padding-left: 0;
        margin-top: 1rem;
        margin-bottom: 1rem;
        text-align: center;
        list-style: none;
    }

    .pager::after {
        display: table;
        clear: both;
        content: "";
    }

    .pager li {
        display: inline;
    }

    .pager li > a,
    .pager li > span {
        display: inline-block;
        padding: 5px 14px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 15px;
    }

    .pager li > a:focus, .pager li > a:hover {
        text-decoration: none;
        background-color: #eceeef;
    }

    .pager .disabled > a, .pager .disabled > a:focus, .pager .disabled > a:hover {
        color: #818a91;
        cursor: not-allowed;
        background-color: #fff;
    }

    .pager .disabled > span {
        color: #818a91;
        cursor: not-allowed;
        background-color: #fff;
    }

    .pager-next > a,
    .pager-next > span {
        float: right;
    }

    .pager-prev > a,
    .pager-prev > span {
        float: left;
    }
</style>
<script>
    export default{
        props: {
            page: Number
            , total: Number
            , pageSize: Number
            , maxLink: Number
            , eventName: String
            , pageHandler: Function
            , createUrl: Function
        }
        , methods: {
            setPage: function(page) {
                if (page === this.page) return false
                if (this.pageHandler) this.pageHandler(page)
                else if (this.$dispatch) this.$dispatch(this.eventName || zPagenav.default.eventName, page)
            }
            , setUrl: function(unit) {
                return url = this.createUrl ? this.createUrl(unit) : (unit.page > 1 ? '#page=' + unit.page : '')
            }
        }
        , computed: {
            units: function() {

                var option = zPagenav.default
                var th = this
                var page = th.page || option.page
                var pageSize = th.pageSize || option.pageSize
                var total = th.total || option.total
                var maxLink = th.maxLink > 5 ? th.maxLink : 5

                var linksCount = Math.ceil(total / pageSize)

                if (page > linksCount) page = linksCount + 0

                var hasPrev = page > 1
                var hasNext = page < linksCount
                var realMaxLink = maxLink > linksCount ? linksCount : maxLink
                var len1, len2, len3, shouldInsertDots12, shouldInsertDots23
                var len2Start, len3Start

                var units = []
                var arr = computeLens()

                units.push({
                    class: hasPrev ? '' : 'disabled'
                    , page: hasPrev ? page - 1 : page
                    , isPager: true
                    , isPrev: true
                    , isNext: false
                    , html: option.prevHtml
                    , srHtml: option.prevSrHtml
                    , ariaLabel: option.prevSrHtml
                })

                var dotUnit = {
                    class: 'disabled'
                    , page: page
                    , isPager: false
                    , isPrev: false
                    , isNext: true
                    , html: option.dotsHtml
                }

                for (var i = 0, len = arr.length; i < len; i++) {
                    pushUnit(arr[i])
                }

                units.push({
                    class: hasNext ? '' : 'disabled'
                    , page: hasNext ? page + 1 : page
                    , isPager: true
                    , isPrev: false
                    , isNext: true
                    , html: option.nextHtml
                    , srHtml: option.nextSrHtml
                    , ariaLabel: option.nextSrHtml
                })

                function pushUnit(i) {
                    if (typeof i === 'number') {
                        units.push({
                            page: i
                            , isPrev: false
                            , isPager: false
                            , disabled: false
                            , class: i === page ? 'active' : ''
                            , isNext: false
                            , html: i
                        })
                    } else units.push(dotUnit)
                }

                function computeLens() {
                    var a4 = Math.floor((realMaxLink - 2) / 2)
                    var a5 = realMaxLink - 3 - a4
                    var s2 = page - a4
                    var s3 = page + a5
                    if (s2 < 2) {
                        s2 = 2
                    }
                    else if (s3 > linksCount) {
                        s2 = linksCount - (realMaxLink - 2)
                    }
                    var arr = [1]
                    if (s2 > 2) arr.push('dot')
                    var it
                    for (var i = 0, len = realMaxLink - 2 < 1 ? realMaxLink - 1 : realMaxLink - 2; i < len; i++) {
                        it = i + s2
                        arr.push(it)
                    }
                    if (it < linksCount - 1) arr.push('dot')
                    if (it < linksCount) arr.push(linksCount)
                    return arr
                }

                return units
                //end unit
            }
        }
    }
</script>
