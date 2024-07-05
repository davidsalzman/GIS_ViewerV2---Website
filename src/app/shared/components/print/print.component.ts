import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../api/api.service';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { IPrintTemplateDTO } from '../../api/models/v1/printTemplate';
import { IPrintTemplateLayerDTO } from '../../api/models/v1/printTemplateLayer';
import { PdfService } from '../../services/pdf.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from '../../services/message.service';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { IUserLayerDTO } from '../../api/models/v1/userLayer';
import { CalciteComponentsModule } from "@esri/calcite-components-angular";
import { ILegendDTO } from '../../api/models/v1/legend';

interface IFormPrint {
    printTemplateId: FormControl<number>;
    title: FormControl<string>;
    fileName: FormControl<string>;
    watermark: FormControl<boolean>;
}

@Component({
    selector: 'print',
    standalone: true,
    imports: [
        CommonModule,
        NgxSpinnerModule,
        CalciteComponentsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        FontAwesomeModule

    ],
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

    public onClose!: EventEmitter<boolean>;
    public mapView!: MapView;
    public mapId!: number;
    public featureLayers!: FeatureLayer[];
    public userFeatureLayers!: IUserLayerDTO[];
    public printTemplates!: IPrintTemplateDTO[];
    public printTemplateLayer!: IPrintTemplateLayerDTO;
    public printTemplateLayers: IPrintTemplateLayerDTO[] = [];
    public legends: ILegendDTO[] = [];
    public printTemplateLayerExpanded: boolean = true;
    public showMapLegends: boolean = false;
    public legendText: string = "";

    faLayerGroup = faLayerGroup;

    public form = this.fb.group<IFormPrint>({

        printTemplateId: this.fb.control(0, { nonNullable: true, validators: [Validators.required] }),
        title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        fileName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
        watermark: this.fb.control(true, { nonNullable: true })

    });


    constructor(private fb: FormBuilder,
        public bsModalRef: BsModalRef,
        private api: ApiService,
        private spinner: NgxSpinnerService,
        private messageService: MessageService,
        private pdfService: PdfService) {

    }
    async ngOnInit(): Promise<void> {
        this.printTemplates = await this.api.printTemplate.getAllAsync();
        this.populatePrintTemplateLayers();
    }


    public onSubmit(confirm: boolean): void {

        if (this.form.valid) {
            try {
                this.spinner.show();
                this.PrintPDF();
            } catch (error) {
                this.messageService.exception(error, 'Failed to create pdf');
            } finally {

                this.spinner.hide();
                this.onClose.next(confirm);
                this.bsModalRef.hide();
            }
        }
        else {
            console.log('Form not valid')
        }



    }
    public async PrintPDF() {
        console.log('Current map scale: 1:' + Math.round(this.mapView.scale))
        const formDetails = this.form.getRawValue();
        const pixel = 3.7795275591;
        console.log(formDetails);
        var mapPrintTemplate = await this.api.printTemplateField.getMapFieldByTemplateAsync(formDetails.printTemplateId);

        const max = { height: mapPrintTemplate.height, width: mapPrintTemplate.width };
        var xMiddle = this.mapView.width / 2;
        var xStart = xMiddle - mapPrintTemplate.width / 2;
        var yMiddle = this.mapView.height / 2;
        var yStart = yMiddle - mapPrintTemplate.height / 2;

        let pixelRatio = window.devicePixelRatio;
        var width = mapPrintTemplate.width * pixel * pixelRatio;
        var height = mapPrintTemplate.height * pixel * pixelRatio;
        let options = {
            width: width,
            height: height

        }

        this.mapView.takeScreenshot(options).then((screenshot) => {

            this.pdfService.CreatePDF(formDetails.printTemplateId, screenshot.dataUrl, formDetails.title, formDetails.fileName, Math.round(this.mapView.scale), formDetails.watermark, this.legends);
        });
    };
    public onChangePrintTemplate(event: any) {
        console.log(event.target.value);
        var printTemplate = this.printTemplates.find(x => x.id == event.target.value)
        console.log(JSON.stringify(printTemplate));
        
        if (printTemplate && printTemplate.maxKeySize > 0) {
            
            this.legendText = "Select up to " + printTemplate.maxKeySize + " legends to be displayed as keys from the layers listed below";
            this.showMapLegends = true;
        }
        else {
            this.showMapLegends = false
        }
        
    }
    public onClickLegend(legend: ILegendDTO) {
        if (this.legends.find(x => x.id == legend.id)) {
            this.legends = this.legends.filter(x => x.id !== legend.id)
        }
        else {
            this.legends.push(legend);
        }
        console.log(JSON.stringify(this.legends));
    }

    private populatePrintTemplateLayers() {
        this.userFeatureLayers.forEach(async featureLayer => {
            const contract = {
                layerId: featureLayer.layerId,
                mapId: this.mapId
            }
            //Only populate Print Template Layers if Layer is currently visable
            if (featureLayer.isVisible) {

                this.printTemplateLayer = {
                    esriLayerId: featureLayer.layerId,
                    id: featureLayer.layerId,
                    title: featureLayer.title,
                    name: featureLayer.title,
                    visible: featureLayer.isVisible,
                    mapId: this.mapId,
                    legends: featureLayer.legends
                }
                console.log(JSON.stringify(this.printTemplateLayer))
                this.printTemplateLayers.push(this.printTemplateLayer);
            }

        });

    }

}