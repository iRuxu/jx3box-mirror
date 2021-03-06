(function($){
    
    if(typeof acf === 'undefined')
        return;
    
    /*
     * Init
     */
    var flexible = acf.getFieldType('flexible_content');
    var model = flexible.prototype;
    
    /*
     * Actions
     */
    
    // Layout: Edit Title
    model.events['focusout input.acfe-flexible-control-title'] = 'acfeEditLayoutTitleToggle';
    model.events['click .acfe-layout-title-text'] = 'acfeEditLayoutTitle';
    model.acfeEditLayoutTitle = function(e, $el){
        
        // Get Flexible
        var flexible = this;
        
        // Title Edition
        if(!flexible.has('acfeFlexibleTitleEdition'))
            return;
        
        // Stop propagation
        e.stopPropagation();
        
        // Toggle
        flexible.acfeEditLayoutTitleToggle(e, $el);
        
    }
    
    model.acfeEditLayoutTitleToggle = function(e, $el){
        
        var flexible = this;
        
        // Vars
        var $layout = $el.closest('.layout');
        var $handle = $layout.find('> .acf-fc-layout-handle');
        var $title = $handle.find('.acfe-layout-title');
        
        
        if(flexible.has('acfeFlexibleModalEdition')){
            
            var $hidden = $layout.find('> .acfe-modal > .acfe-modal-wrapper > .acfe-modal-content > .acf-fields > .acf-field-acfe-flexible-layout-title > .acf-input > .acf-input-wrap > input');
        
        }else{
            
            var $hidden = $layout.find('> .acf-fields > .acf-field-acfe-flexible-layout-title > .acf-input > .acf-input-wrap > input');
            
        }
        
        // Hidden Input
        if($hidden.length){
            
            // Add Edit Title
            $hidden.addClass('acfe-flexible-control-title').attr('data-acfe-flexible-control-title-input', 1).insertAfter($handle);
            
            // Remove legacy field
            $layout.find('> .acf-fields > .acf-field-acfe-flexible-layout-title').remove();
        
        }
        
        if($layout.hasClass('acfe-flexible-title-edition')){
            
            var $input = $title.find('> input[data-acfe-flexible-control-title-input]');
            
            if($input.val() === '')
                $input.val($input.attr('placeholder')).trigger('input');
            
            $layout.removeClass('acfe-flexible-title-edition');
            
            $input.insertAfter($handle);
            
        }
        
        else{
            
            var $input = $layout.find('> input[data-acfe-flexible-control-title-input]');
            
            var $input = $input.appendTo($title);
            
            $layout.addClass('acfe-flexible-title-edition');
            $input.focus().attr('size', $input.val().length);
            
        }
        
    }
    
    // Layout: Edit Title
    model.events['click input.acfe-flexible-control-title'] = 'acfeEditLayoutTitlePropagation';
    model.acfeEditLayoutTitlePropagation = function(e, $el){
        
        e.stopPropagation();
        
    }
    
    // Layout: Edit Title Input
    model.events['input [data-acfe-flexible-control-title-input]'] = 'acfeEditLayoutTitleInput';
    model.acfeEditLayoutTitleInput = function(e, $el){
        
        // Vars
        var $layout = $el.closest('.layout');
        var $title = $layout.find('> .acf-fc-layout-handle .acfe-layout-title .acfe-layout-title-text');
        
        var val = $el.val();
        
        $el.attr('size', val.length);
        
        $title.html(val);
        
    }
    
    // Layout: Edit Title Input Enter
    model.events['keypress [data-acfe-flexible-control-title-input]'] = 'acfeEditLayoutTitleInputEnter';
    model.acfeEditLayoutTitleInputEnter = function(e, $el){
        
        // Enter Key
        if(e.keyCode != 13)
            return;
        
        e.preventDefault();
        $el.blur();
        
    }
    
    // Layout: Clone
    model.events['click [data-acfe-flexible-control-clone]'] = 'acfeCloneLayout';
    model.acfeCloneLayout = function(e, $el){
        
        // Get Flexible
        var flexible = this;
        
        // Vars
        var $layout_original = $el.closest('.layout');
        var $layout = $el.closest('.layout').clone();
        
        // Fix inputs
        flexible.acfeFixInputs($layout);
        
        // Clean Layout
        flexible.acfeCleanLayouts($layout);
        
        var parent = $el.closest('.acf-flexible-content').find('> input[type=hidden]').attr('name');
        
        // Clone
        var $layout_added = flexible.acfeDuplicate({
            layout: $layout,
            before: $layout_original,
            parent: parent
        });
        
    }
    
    // Layout: Copy
    model.events['click [data-acfe-flexible-control-copy]'] = 'acfeCopyLayout';
    model.acfeCopyLayout = function(e, $el){
        
        // Get Flexible
        var flexible = this;
        
        // Vars
        var $layout = $el.closest('.layout').clone();
        var source = flexible.$control().find('> input[type=hidden]').attr('name');
        
        // Fix inputs
        flexible.acfeFixInputs($layout);
        
        // Clean layout
        flexible.acfeCleanLayouts($layout);
        
        // Get layout data
        var data = JSON.stringify({
            source: source,
            layouts: $layout[0].outerHTML
        });
        
        // Append Temp Input
        var $input = $('<input type="text" style="clip:rect(0,0,0,0);clip-path:rect(0,0,0,0);position:absolute;" value="" />').appendTo($el);
        $input.attr('value', data).select();
        
        // Command: Copy
        if(document.execCommand('copy'))
            alert('Layout has been transferred to your clipboard');
            
        // Prompt
        else
            prompt('Copy the following layout data to your clipboard', data);
        
        // Remove the temp input
        $input.remove();
        
    }
    
    // Flexible: Copy Layouts
    model.acfeCopyLayouts = function(){
        
        // Get Flexible
        var flexible = this;
        
        // Get layouts
        var $layouts = flexible.$layoutsWrap().clone();
        var source = flexible.$control().find('> input[type=hidden]').attr('name');
        
        // Fix inputs
        flexible.acfeFixInputs($layouts);
        
        // Clean layout
        flexible.acfeCleanLayouts($layouts);
        
        // Get layouts data
        var data = JSON.stringify({
            source: source,
            layouts: $layouts.html()
        });
        
        // Append Temp Input
        var $input = $('<input type="text" style="clip:rect(0,0,0,0);clip-path:rect(0,0,0,0);position:absolute;" value="" />').appendTo(flexible.$el);
        $input.attr('value', data).select();
        
        // Command: Copy
        if(document.execCommand('copy'))
            alert('Layouts have been transferred to your clipboard');
            
        // Prompt
        else
            prompt('Copy the following layouts data to your clipboard', data);
        
        $input.remove();
        
    }
    
    // Flexible: Paste Layouts
    model.acfePasteLayouts = function(){
        
        // Get Flexible
        var flexible = this;
        
        var paste = prompt('Paste layouts data in the following field');
        
        // No input
        if(paste == null || paste === '')
            return;
        
        try{
            
            // Paste HTML
            var data = JSON.parse(paste);
            var source = data.source;
            var $html = $(data.layouts);
            
            // Parsed layouts
            var $html_layouts = $html.closest('[data-layout]');
            
            if(!$html_layouts.length)
                return alert('No layouts data available');
            
            // init
            var validated_layouts = [];
            
            // Each first level layouts
            $html_layouts.each(function(){
                
                var $this = $(this);
                
                // Validate layout against available layouts
                var get_clone_layout = flexible.$clone($this.attr('data-layout'));
                
                // Layout is invalid
                if(!get_clone_layout.length)
                    return;
                
                // Add validated layout
                validated_layouts.push($this);
                
            });
            
            // Nothing to add
            if(!validated_layouts.length)
                return alert('No corresponding layouts found');
            
            // Add layouts
            $.each(validated_layouts, function(){
                
                var $layout = $(this);
                var search = source + '[' + $layout.attr('data-id') + ']';
                var target = flexible.$control().find('> input[type=hidden]').attr('name');
                
                flexible.acfeDuplicate({
                    layout: $layout,
                    before: false,
                    search: search,
                    parent: target
                });
                
            });
            
        }catch(e){
            
            console.log(e);
            alert('Invalid data');
            
        }
        
    }
    
    // Flexible: Dropdown
    model.events['click [data-name="acfe-flexible-control-button"]'] = 'acfeControl';
    model.acfeControl = function(e, $el){
        
        // Get Flexible
        var flexible = this;
        
        // Vars
        var $dropdown = $el.next('.tmpl-acfe-flexible-control-popup').html();
        
        // Init Popup
        var Popup = acf.models.TooltipConfirm.extend({
            render: function(){
                this.html(this.get('text'));
                this.$el.addClass('acf-fc-popup');
            }
        });
        
        // New Popup
        var popup = new Popup({
            target: $el,
            targetConfirm: false,
            text: $dropdown,
            context: flexible,
            confirm: function(e, $el){
                
                if($el.attr('data-acfe-flexible-control-action') === 'paste')
                    flexible.acfePasteLayouts();
                
                else if($el.attr('data-acfe-flexible-control-action') === 'copy')
                    flexible.acfeCopyLayouts();
                
            }
        });
        
        popup.on('click', 'a', 'onConfirm');
        
    }
    
    // Flexible: Duplicate
    model.acfeDuplicate = function(args){
        
        // Arguments
        args = acf.parseArgs(args, {
            layout: '',
            before: false,
            parent: false,
            search: '',
            replace: '',
        });
        
        // Validate
        if(!this.allowAdd())
            return false;
        
        var uniqid = acf.uniqid();
        
        if(args.parent){
            
            if(!args.search){
                
                args.search = args.parent + '[' + args.layout.attr('data-id') + ']';
                
            }
            
            args.replace = args.parent + '[' + uniqid + ']';
            
        }
        
        // Add row
        var $el = acf.duplicate({
            target: args.layout,
            search: args.search,
            replace: args.replace,
            append: this.proxy(function($el, $el2){
                
                // Add class to duplicated layout
                $el2.addClass('acfe-layout-duplicated');
                
                // Reset UniqID
                $el2.attr('data-id', uniqid);
                
                // append before
                if(args.before){
                    
                    // Fix clone: Use after() instead of native before()
                    args.before.after($el2);
                    
                }
                
                // append end
                else{
                    
                    this.$layoutsWrap().append($el2);
                    
                }
                
                // enable 
                acf.enable($el2, this.cid);
                
                // render
                this.render();
                
            })
        });
        
        // trigger change for validation errors
        this.$input().trigger('change');
        
        // return
        return $el;
        
    }
    
    // Flexible: Fix Inputs
    model.acfeFixInputs = function($layout){
        
        $layout.find('input').each(function(){
            
            $(this).attr('value', this.value);
            
        });
        
        $layout.find('textarea').each(function(){
            
            $(this).html(this.value);
            
        });
        
        $layout.find('input:radio,input:checkbox').each(function() {
            
            if(this.checked)
                $(this).attr('checked', 'checked');
            
            else
                $(this).attr('checked', false);
            
        });
        
        $layout.find('option').each(function(){
            
            if(this.selected)
                $(this).attr('selected', 'selected');
                
            else
                $(this).attr('selected', false);
            
        });
        
    }
    
    // Flexible: Clean Layout
    model.acfeCleanLayouts = function($layout){
        
        // Clean WP Editor
        $layout.find('.acf-editor-wrap').each(function(){
            
            var $input = $(this);
            
            $input.find('.wp-editor-container div').remove();
            $input.find('.wp-editor-container textarea').css('display', '');
            
        });
        
        // Clean Date
        $layout.find('.acf-date-picker').each(function(){
            
            var $input = $(this);
            
            $input.find('input.input').removeClass('hasDatepicker').removeAttr('id');
            
        });
        
        // Clean Time
        $layout.find('.acf-time-picker').each(function(){
            
            var $input = $(this);
            
            $input.find('input.input').removeClass('hasDatepicker').removeAttr('id');
            
        });
        
        // Clean DateTime
        $layout.find('.acf-date-time-picker').each(function(){
            
            var $input = $(this);
            
            $input.find('input.input').removeClass('hasDatepicker').removeAttr('id');
            
        });
        
        // Clean Color Picker
        $layout.find('.acf-color-picker').each(function(){
            
            var $input = $(this);
            
            var $color_picker = $input.find('> input');
            var $color_picker_proxy = $input.find('.wp-picker-container input.wp-color-picker').clone();
            
            $color_picker.after($color_picker_proxy);
            
            $input.find('.wp-picker-container').remove();
            
        });
        
        // Clean Post Object
        $layout.find('.acf-field-post-object').each(function(){
            
            var $input = $(this);
            
            $input.find('> .acf-input span').remove();
            
            $input.find('> .acf-input select').removeAttr('tabindex aria-hidden').removeClass();
            
        });
        
        // Clean Page Link
        $layout.find('.acf-field-page-link').each(function(){
            
            var $input = $(this);
            
            $input.find('> .acf-input span').remove();
            
            $input.find('> .acf-input select').removeAttr('tabindex aria-hidden').removeClass();
            
        });
        
        // Clean Select2
        $layout.find('.acf-field-select').each(function(){
            
            var $input = $(this);
            
            $input.find('> .acf-input span').remove();
            
            $input.find('> .acf-input select').removeAttr('tabindex aria-hidden').removeClass();
            
        });
        
        // Clean FontAwesome
        $layout.find('.acf-field-font-awesome').each(function(){
            
            var $input = $(this);
            
            $input.find('> .acf-input span').remove();
            
            $input.find('> .acf-input select').removeAttr('tabindex aria-hidden');
            
        });
        
        // Clean Tab
        $layout.find('.acf-tab-wrap').each(function(){
            
            var $wrap = $(this);
            
            var $content = $wrap.closest('.acf-fields');
            
            var tabs = []
            $.each($wrap.find('li a'), function(){
                
                tabs.push($(this));
                
            });
            
            $content.find('> .acf-field-tab').each(function(){
                
                $current_tab = $(this);
                
                $.each(tabs, function(){
                    
                    var $this = $(this);
                    
                    if($this.attr('data-key') != $current_tab.attr('data-key'))
                        return;
                    
                    $current_tab.find('> .acf-input').append($this);
                    
                });
                
            });
            
            $wrap.remove();
            
        });
        
        // Clean Accordion
        $layout.find('.acf-field-accordion').each(function(){
            
            var $input = $(this);
            
            $input.find('> .acf-accordion-title > .acf-accordion-icon').remove();
            
            // Append virtual endpoint after each accordion
            $input.after('<div class="acf-field acf-field-accordion" data-type="accordion"><div class="acf-input"><div class="acf-fields" data-endpoint="1"></div></div></div>');
            
        });
        
    }
    
    /*
     * Spawn
     */
    acf.addAction('new_field/type=flexible_content', function(flexible){
        
        if(!flexible.has('acfeFlexibleCopyPaste'))
            return;
        
        /* 
         * Stylised Button
         */
        if(flexible.has('acfeFlexibleStylisedButton')){
            
            var $dropdown = $('' +
            '<a href="#" class="button" style="padding-left:5px;padding-right:5px; margin-left:3px;" data-name="acfe-flexible-control-button">' +
            '   <span class="dashicons dashicons-arrow-down-alt2" style="vertical-align:text-top;width:auto;height:auto;font-size:13px;line-height:20px;"></span>' +
            '</a>' +
            
            '<script type="text-html" class="tmpl-acfe-flexible-control-popup">' +
            '   <ul>' +
            '       <li><a href="#" data-acfe-flexible-control-action="copy">Copy layouts</a></li>' +
            '       <li><a href="#" data-acfe-flexible-control-action="paste">Paste layouts</a></li>' +
            '   </ul>' +
            '</script>');
            
            // Add button
            flexible.$el.find('> .acf-input > .acf-flexible-content > .acfe-flexible-stylised-button > .acf-actions > .acf-button').after($dropdown);
            
        
        }
        
        /* 
         * Unstylised
         */
        else{
            
            var $dropdown = $('' +
            '<a href="#" class="button button-primary" style="padding-left:5px;padding-right:5px; margin-left:3px;" data-name="acfe-flexible-control-button">' +
            '   <span class="dashicons dashicons-arrow-down-alt2" style="vertical-align:text-top;width:auto;height:auto;font-size:13px;line-height:20px;"></span>' +
            '</a>' +
            
            '<script type="text-html" class="tmpl-acfe-flexible-control-popup">' +
            '   <ul>' +
            '       <li><a href="#" data-acfe-flexible-control-action="copy">Copy layouts</a></li>' +
            '       <li><a href="#" data-acfe-flexible-control-action="paste">Paste layouts</a></li>' +
            '   </ul>' +
            '</script>');
            
            // Add button
            flexible.$el.find('> .acf-input > .acf-flexible-content > .acf-actions > .acf-button').after($dropdown);
            
        }
        
    });
    
    acf.addAction('acfe/flexible/layouts', function($layout, flexible){
        
        // vars
        var $controls = $layout.find('> .acf-fc-layout-controls');
        
        // Button: Copy
        if(flexible.has('acfeFlexibleCopyPaste') && !$controls.has('[data-acfe-flexible-control-copy]').length){
            
            $controls.prepend('<a class="acf-icon small light acf-js-tooltip acfe-flexible-icon dashicons dashicons-category" href="#" title="Copy layout" data-acfe-flexible-control-copy="' + $layout.attr('data-layout') + '"></a>');
        
        }
        
        // Button: Clone
        if(!$controls.has('[data-acfe-flexible-control-clone]').length){
            
            $controls.prepend('<a class="acf-icon small light acf-js-tooltip acfe-flexible-icon dashicons dashicons-admin-page" href="#" title="Clone layout" data-acfe-flexible-control-clone="' + $layout.attr('data-layout') + '"></a>');
            
        }
        
        
        
    });
    
})(jQuery);